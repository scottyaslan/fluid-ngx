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

import { async, tick, fakeAsync } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { cfxConfigureTestingModule } from 'webapp/testing/configureTestingModule';
import { cfxCreateComponent, CfxComponentFixture } from 'webapp/testing/createComponent';
import { RangeInputComponent } from './range-input.component';
import { RangeInputModule } from './range-input.module';

@Component({
    template: `<cfx-range-input #input
                                [(ngModel)]="value"
                                [min]="min"
                                [max]="max"
                                [disabled]="inputDisabled"></cfx-range-input>`
})
class TestComponent {
    @ViewChild('input', { static: false }) input: RangeInputComponent;
    value = { min: 20, max: 80 };
    min = 10;
    max = 90;
    inputDisabled = true;
}

describe('RangeInputComponent', () => {
    let component: RangeInputComponent;
    let fixture: CfxComponentFixture<RangeInputComponent>;
    let parentFixture: CfxComponentFixture<TestComponent>;
    let parentComponent: TestComponent;

    beforeEach(async(() => {
        cfxConfigureTestingModule({
            imports: [
                FormsModule,
                RangeInputModule
            ],
            declarations: [TestComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = cfxCreateComponent(RangeInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        parentFixture = cfxCreateComponent(TestComponent);
        parentComponent = parentFixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('should handle min-max position change', () => {
        it('via parent component', fakeAsync(() => {
            parentFixture.detectChanges();
            tick();

            expect(parentComponent.input.value).toEqual({ min: 20, max: 80 });

            parentComponent.value = { min: 60, max: 50 };
            parentFixture.detectChanges();
            tick();

            expect(parentComponent.input.value).toEqual({ min: 50, max: 60 });
        }));

        it('via direct call', () => {
            component.value = { min: 10, max: 50 };
            fixture.detectChanges();

            expect(component.value).toEqual({ min: 10, max: 50 });

            component.value = { min: 60, max: 50 };
            fixture.detectChanges();

            expect(component.value).toEqual({ min: 50, max: 60 });
        });
    });

    it('should toggle disabled status via parent component', fakeAsync(() => {
        parentFixture.detectChanges();
        tick();
        expect(parentComponent.input.formGroup.disabled).toBe(true, 'disabled as default');

        parentComponent.inputDisabled = false;
        parentFixture.detectChanges();
        tick();

        expect(parentComponent.input.formGroup.disabled).toBe(false, 'after it is enabled');
    }));

    describe('if min is changed, then', () => {
        it('should update value.min if new min is greater than value.min', fakeAsync(() => {
            parentFixture.detectChanges();
            tick();

            expect(parentComponent.input.min).toBe(10);
            expect(parentComponent.input.value.min).toBe(20);

            parentComponent.min = 30;
            parentFixture.detectChanges();
            tick();

            expect(parentComponent.input.min).toBe(30);
            expect(parentComponent.input.value.min).toBe(30);
        }));

        it('should not update value.min if new min is less than value.min', fakeAsync(() => {
            parentFixture.detectChanges();
            tick();

            expect(parentComponent.input.min).toBe(10);
            expect(parentComponent.input.value.min).toBe(20);

            parentComponent.min = 15;
            parentFixture.detectChanges();
            tick();

            expect(parentComponent.input.min).toBe(15);
            expect(parentComponent.input.value.min).toBe(20);
        }));
    });

    describe('if max is changed, then', () => {
        it('should update value.max if new max is less than value.max', fakeAsync(() => {
            parentFixture.detectChanges();
            tick();

            expect(parentComponent.input.max).toBe(90);
            expect(parentComponent.input.value.max).toBe(80);

            parentComponent.max = 50;
            parentFixture.detectChanges();
            tick();

            expect(parentComponent.input.max).toBe(50);
            expect(parentComponent.input.value.max).toBe(50);
        }));

        it('should not update value.max if new max is greater than value.max', fakeAsync(() => {
            parentFixture.detectChanges();
            tick();

            expect(parentComponent.input.max).toBe(90);
            expect(parentComponent.input.value.max).toBe(80);

            parentComponent.max = 85;
            parentFixture.detectChanges();
            tick();

            expect(parentComponent.input.max).toBe(85);
            expect(parentComponent.input.value.max).toBe(80);
        }));
    });
});
