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

import { By } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { cfxConfigureTestingModule } from 'webapp/testing/configureTestingModule';

import { StepperComponent, Step } from './stepper.component';
import { StepperModule } from './stepper.module';

const testSteps: Step[] = [
    {
        id: 0,
        completed: true,
        text: 'Test0'
    },
    {
        id: 1,
        active: true,
        text: 'Test1'
    },
    {
        id: 2,
        text: 'Test2'
    }
];

describe('StepperComponent', () => {
    let component: StepperComponent;
    let fixture: ComponentFixture<StepperComponent>;

    beforeEach(async(() => {
        cfxConfigureTestingModule({
            imports: [StepperModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StepperComponent);
        component = fixture.componentInstance;
        component.steps = testSteps;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create a step div for each step', () => {
        const stepElements = fixture.debugElement.queryAll(By.css('.step'));

        expect(stepElements.length).toEqual(component.steps.length);
    });

    it('should set the text from the step object', () => {
        fixture.debugElement.queryAll(By.css('.step-name')).forEach((element, idx) => {
            expect(element.nativeElement.innerText).toEqual(component.steps[idx].text);
        });
    });

    it('should add active class for the active step', () => {
        const activeStep = testSteps.find((step) => step.active);
        const activeElement = fixture.debugElement.query(By.css('.active .step-name'));

        expect(activeElement.nativeElement.innerText).toEqual(activeStep.text);
    });
});
