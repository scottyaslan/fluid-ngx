/*
 * (c) 2018-2020 Cloudera, Inc. All rights reserved.
 *
 *  This code is provided to you pursuant to your written agreement with Cloudera, which may be the terms of the
 *  Affero General Public License version 3 (AGPLv3), or pursuant to a written agreement with a third party authorized
 *  to distribute this code.  If you do not have a written agreement with Cloudera or with an authorized and
 *  properly licensed third party, you do not have any rights to this code.
 *
 *  If this code is provided to you under the terms of the AGPLv3:
 *   (A) CLOUDERA PROVIDES THIS CODE TO YOU WITHOUT WARRANTIES OF ANY KIND;
 *   (B) CLOUDERA DISCLAIMS ANY AND ALL EXPRESS AND IMPLIED WARRANTIES WITH RESPECT TO THIS CODE, INCLUDING BUT NOT
 *       LIMITED TO IMPLIED WARRANTIES OF TITLE, NON-INFRINGEMENT, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE;
 *   (C) CLOUDERA IS NOT LIABLE TO YOU, AND WILL NOT DEFEND, INDEMNIFY, OR HOLD YOU HARMLESS FOR ANY CLAIMS ARISING
 *       FROM OR RELATED TO THE CODE; AND
 *   (D) WITH RESPECT TO YOUR EXERCISE OF ANY RIGHTS GRANTED TO YOU FOR THE CODE, CLOUDERA IS NOT LIABLE FOR ANY
 *       DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, PUNITIVE OR CONSEQUENTIAL DAMAGES INCLUDING, BUT NOT LIMITED
 *       TO, DAMAGES RELATED TO LOST REVENUE, LOST PROFITS, LOSS OF INCOME, LOSS OF BUSINESS ADVANTAGE OR
 *       UNAVAILABILITY, OR LOSS OR CORRUPTION OF DATA.
 */

import { Component, OnInit, Input, EventEmitter, Output, ViewChild, AfterViewInit, Renderer2, OnChanges, SimpleChanges, ViewEncapsulation, forwardRef } from '@angular/core';
import { FormGroup, FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSlider } from '@angular/material/slider';
import { merge, Subject } from 'rxjs';
import { tap, takeUntil, map } from 'rxjs/operators';

export interface MinMax {
    min: number;
    max: number;
}

export interface RangeSliderChange {
    value: MinMax;
}

@Component({
    selector: 'cfx-range-slider',
    templateUrl: './range-slider.component.html',
    styleUrls: ['./range-slider.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        // eslint-disable-next-line no-use-before-define
        useExisting: forwardRef(() => RangeSliderComponent),
        multi: true
    }],
    encapsulation: ViewEncapsulation.None
})
export class RangeSliderComponent implements OnInit, AfterViewInit, OnChanges, ControlValueAccessor {
    @ViewChild('sMin', { static: true }) sliderMin: MatSlider;
    @ViewChild('sMax', { static: true }) sliderMax: MatSlider;

    // data bound only
    @Input() disabled: boolean = false;
    @Input() invert: boolean;
    @Input() max: number = 100;
    @Input() min: number = 0;
    @Input() vertical: boolean;

    // works with explicit call
    @Input() displayLabel: boolean = true;
    @Input() displayWith: any;
    @Input() step: number;
    @Input() tabIndex: number;
    @Input() thumbLabel: boolean;
    @Input() tickInterval: number;
    @Input()
    get value(): MinMax | null {
        return this.formGroupValueCorrected;
    }

    set value(value: MinMax | null) {
        this.writeToFormGroup(value);
    }

    @Output() readonly change = new EventEmitter<RangeSliderChange>();
    /** Event emitted when the slider thumb moves. */
    @Output() readonly input = new EventEmitter<RangeSliderChange>();
    /**
     * Emits when the raw value of the slider changes. This is here primarily
     * to facilitate the two-way binding for the `value` input.
     * @docs-private
     */
    @Output() readonly valueChange: EventEmitter<MinMax> = new EventEmitter<MinMax>();

    /** `View -> model callback called when value changes` */
    onChangeFn: (value: MinMax) => void = () => { };
    /** `View -> model callback called when autocomplete has been touched` */
    onTouchedFn = () => { };
    /** we detect the slider nearest to the cursor and apply mouse events on that one */
    sliderNearestToCursor: 'sMin' | 'sMax' = null;

    switchCase = false;
    formGroup = new FormGroup({
        min: new FormControl(),
        max: new FormControl()
    });

    private fillBarEl: HTMLElement;
    private componentDestroyed = new Subject();
    private beforeOnInit = true;

    private get formGroupValueCorrected(): MinMax {
        return this.getCorrectedValue(this.formGroup.value);
    }

    constructor(private renderer2: Renderer2) {
        this.formGroup.valueChanges
            .pipe(takeUntil(this.componentDestroyed))
            .subscribe((v: MinMax) => {
                this.onChangeFn(this.getCorrectedValue(v));
            });
    }

    ngOnInit() {
        this.resetFormGroup(true);
        this.setDisabledState(this.disabled);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.beforeOnInit) { return; }
        const fgv = this.formGroup.value;
        if (changes['max']) {
            if (changes['max'].currentValue < fgv.max) {
                if (this.formGroup.get('max')) {
                    const c = this.switchCase ? 'min' : 'max';
                    this.formGroup.get(c)!.setValue(changes[c].currentValue);
                }
            }
            this.calculateFillBar();
        }
        if (changes['min']) {
            if (changes['min'].currentValue > fgv.min) {
                if (this.formGroup.get('min')) {
                    const c = this.switchCase ? 'max' : 'min';
                    this.formGroup.get(c)!.setValue(changes[c].currentValue);
                }
            }
            this.calculateFillBar();
        }
        if (changes['value']) {
            this.calculateFillBar();
        }
        if (changes['invert']) {
            this.calculateFillBar();
        }
        if (changes['vertical']) {
            if (changes['vertical'].currentValue) {
                this.renderer2.setStyle(this.fillBarEl, 'margin-left', null);
                this.renderer2.setStyle(this.fillBarEl, 'width', null);
            } else {
                this.renderer2.setStyle(this.fillBarEl, 'bottom', null);
                this.renderer2.setStyle(this.fillBarEl, 'height', null);
            }
            this.calculateFillBar();
        }
        if (changes['disabled']) {
            this.setDisabledState(this.disabled);
        }
    }

    ngAfterViewInit() {
        const a = merge(
            this.sliderMax.valueChange.pipe(map((max) => this.correctRange(max!, 'max'))),
            this.sliderMin.valueChange.pipe(map((min) => this.correctRange(min!))),
        ).pipe(
            tap((v) => this.valueChange.next(v))
        );
        const b = merge(
            this.sliderMax.input.pipe(map((_) => this.correctRange(_.value!, 'max'))),
            this.sliderMin.input.pipe(map((_) => this.correctRange(_.value!))),
        ).pipe(
            tap((v) => {
                this.input.next({ value: v });
                this.calculateFillBar(v);
            })
        );
        const c = merge(
            this.sliderMax.change.pipe(map((_) => this.correctRange(_.value!, 'max'))),
            this.sliderMin.change.pipe(map((_) => this.correctRange(_.value!))),
        ).pipe(
            tap((v) => this.change.next({ value: v }))
        );
        merge(a, b, c).pipe(takeUntil(this.componentDestroyed))
            .subscribe();
        // eslint-disable-next-line no-underscore-dangle
        this.fillBarEl = this.sliderMax._elementRef.nativeElement
            .children[0]
            .children[0]
            .children[1];
        this.beforeOnInit = false;
        this.calculateFillBar();
    }

    ngOnDestroy() {
        this.componentDestroyed.next();
        this.componentDestroyed.complete();
    }

    // Implemented as part of ControlValueAccessor.
    writeValue(value: any): void {
        this.writeToFormGroup(value);
        this.calculateFillBar();
    }

    // Implemented as part of ControlValueAccessor.
    registerOnChange(fn: (value: MinMax) => {}): void {
        this.onChangeFn = fn;
    }

    // Implemented as part of ControlValueAccessor.
    registerOnTouched(fn: () => {}) {
        this.onTouchedFn = fn;
    }

    // Implemented as part of ControlValueAccessor.
    setDisabledState(isDisabled: boolean) {
        if (isDisabled) {
            this.formGroup.disable();
        } else {
            this.formGroup.enable();
        }
    }

    onMouseMove(event: MouseEvent) {
        try {
            const containerElementRect = (event.currentTarget as HTMLElement).getBoundingClientRect();
            const padding = 8;
            const cursorPos = (event.clientX - containerElementRect.left - padding) / (containerElementRect.width - 2 * padding);
            const minPos = (this.sliderMin.value - this.min) / (this.max - this.min);
            const maxPos = (this.sliderMax.value - this.min) / (this.max - this.min);
            this.sliderNearestToCursor = (Math.abs(minPos - cursorPos) < Math.abs(maxPos - cursorPos)) ? 'sMin' : 'sMax';
        } catch (e) {
            // in case of missing browser support or any other edge case both sliders remain clickable
            this.sliderNearestToCursor = null; // both
        }
    }

    private getCorrectedValue(v: MinMax): MinMax {
        return (v.min > v.max) ? { min: v.max, max: v.min } : { ...v };
    }

    /** If min overtakes max or other way around we have to correct for that */
    private correctRange(value: number, useCase: 'min' | 'max' = 'min', formGroupValue = this.formGroup.value): MinMax {
        let ans: MinMax;
        if (useCase === 'min') {
            if (value <= formGroupValue.max) {
                ans = { ...formGroupValue, min: value };
                this.switchCase = false;
            } else {
                ans = { min: formGroupValue.max, max: value };
                this.switchCase = true;
            }
        } else if (value > formGroupValue.min) {
            ans = { ...formGroupValue, max: value };
            this.switchCase = false;
        } else {
            ans = { min: value, max: formGroupValue.min };
            this.switchCase = true;
        }
        return ans;
    }

    /** On (input) of mat-slider we need to span the fillbar between min and max */
    private calculateFillBar(value: MinMax = this.formGroupValueCorrected) {
        if (!this.fillBarEl) {
            return;
        }
        const r = this.max - this.min;
        // width in percent
        const wPCT = ((value.max - value.min) / r) * 100;
        const myDim = this.vertical ? 'height' : 'width';
        this.renderer2.setStyle(this.fillBarEl, myDim, `${wPCT}%`);
        let mlPCT: number;
        if (this.invert) {
            mlPCT = ((this.max - value.max) / r) * 100;
        } else {
            // margin-left in percent
            mlPCT = ((value.min - this.min) / r) * 100;
        }
        const myMargin = this.vertical ? 'bottom' : 'margin-left';
        this.renderer2.setStyle(this.fillBarEl, myMargin, `${mlPCT}%`);
    }

    private resetFormGroup(emit = false) {
        this.formGroup.setValue(
            {
                min: this.min ? this.min : 0,
                max: this.max ? this.max : 100
            },
            { emitEvent: emit }
        );
    }

    private writeToFormGroup(value: MinMax) {
        if (!value) {
            this.resetFormGroup();
            return;
        }

        const b1 = typeof value === 'object'
            && value !== null
            // eslint-disable-next-line no-prototype-builtins
            && value.hasOwnProperty('min')
            // eslint-disable-next-line no-prototype-builtins
            && value.hasOwnProperty('max');

        if (b1) {
            const b2 = !Number.isNaN(Number(value.min))
                && !Number.isNaN(Number(value.max));
            if (b2) {
                this.formGroup.setValue(value);
            } else {
                this.resetFormGroup();
            }
            return;
        }

        this.resetFormGroup();
    }
}
