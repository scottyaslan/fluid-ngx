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

import { Component, OnInit, Input, EventEmitter, Output, AfterViewInit, OnChanges, SimpleChanges, ViewEncapsulation, forwardRef } from '@angular/core';
import { FormGroup, FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface MinMax {
    min: number;
    max: number;
}

export interface RangeInputChange {
    value: MinMax;
}

@Component({
    selector: 'cfx-range-input',
    templateUrl: './range-input.component.html',
    styleUrls: ['./range-input.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        // eslint-disable-next-line no-use-before-define
        useExisting: forwardRef(() => RangeInputComponent),
        multi: true
    }],
    encapsulation: ViewEncapsulation.None
})
export class RangeInputComponent implements OnInit, AfterViewInit, OnChanges, ControlValueAccessor {
    @Input() disabled: boolean = false;
    @Input() max: number = 100;
    @Input() min: number = 0;
    @Input() labelText: string;
    @Input() displayLabel: boolean = true;
    @Input() tabIndex: number;
    @Input('ngModel')
    get value(): MinMax | null {
        return this.formGroup.value;
    }

    set value(value: MinMax | null) {
        this.writeToFormGroup(this.getCorrectedValue(value));
    }

    @Output() readonly change = new EventEmitter<RangeInputChange>();
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

    switchCase = false;
    formGroup = new FormGroup({
        min: new FormControl(),
        max: new FormControl()
    });

    private componentDestroyed = new Subject();
    private beforeOnInit = true;


    constructor() {
        this.formGroup.valueChanges
            .pipe(takeUntil(this.componentDestroyed))
            .subscribe((v: MinMax) => {
                this.onChangeFn(v);
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
        }
        if (changes['min']) {
            if (changes['min'].currentValue > fgv.min) {
                if (this.formGroup.get('min')) {
                    const c = this.switchCase ? 'max' : 'min';
                    this.formGroup.get(c)!.setValue(changes[c].currentValue);
                }
            }
        }
        if (changes['disabled']) {
            this.setDisabledState(this.disabled);
        }
    }

    ngAfterViewInit() {
        this.beforeOnInit = false;
    }

    ngOnDestroy() {
        this.componentDestroyed.next();
        this.componentDestroyed.complete();
    }

    // Implemented as part of ControlValueAccessor.
    writeValue(value: any): void {
        this.writeToFormGroup(value);
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

    onValueChanged() {
        const { value } = this.formGroup;
        if (Number(value.min) > Number(value.max)) {
            this.writeToFormGroup({ min: value.max, max: value.min });
        }
        this.change.next({ value: this.formGroup.value });
        this.onTouchedFn();
    }

    private getCorrectedValue(v: MinMax): MinMax {
        let val = { ...v };
        if (v.min > v.max) {
            val = { min: v.max, max: v.min } as MinMax;
        }
        return val;
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
