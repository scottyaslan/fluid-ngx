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

import { TestBed, ComponentFixture, tick } from '@angular/core/testing';
import { Type } from '@angular/core';

// helpers
export const queryByDataQa = (element: HTMLElement, qa: string): HTMLElement => element.querySelector(`[data-qa=${qa}]`);
export const queryByDataQaContains = (element: HTMLElement, qa: string, extraSelector = ''): HTMLElement => element.querySelector(`[data-qa*=${qa}] ${extraSelector}`);
export const queryAllByDataQa = (element: HTMLElement, qa: string): HTMLElement[] => Array.from(element.querySelectorAll(`[data-qa=${qa}]`));
export const queryAllByDataQaContains = (element: HTMLElement, qa: string, extraSelector = ''): HTMLElement[] => Array.from(element.querySelectorAll(`[data-qa*=${qa}] ${extraSelector}`));
export const writeValueIntoInput = (element: HTMLElement, value: any) => {
    // eslint-disable-next-line no-param-reassign
    element['value'] = value;
    element.dispatchEvent(new Event('input'));
};

// ComponentFixture extensions
export interface CfxComponentFixture<T> extends ComponentFixture<T> {
    queryByDataQa: (qa: string) => HTMLElement;
    queryByDataQaContains: (qa: string, extraSelector?: string) => HTMLElement;
    queryAllByDataQa: (qa: string) => HTMLElement[];
    queryAllByDataQaContains: (qa: string, extraSelector?: string) => HTMLElement[];
    writeValueIntoInput: (element: HTMLElement, value: any) => void;
}

// creates component fixture for the platform
export function cfxCreateComponent<T>(component: Type<T>): CfxComponentFixture<T> {
    const fixture = TestBed.createComponent(component) as CfxComponentFixture<T>;
    fixture.queryByDataQa = (qa: string) => queryByDataQa(fixture.nativeElement, qa);
    fixture.queryByDataQaContains = (qa: string, extraSelector?: string) => queryByDataQaContains(fixture.nativeElement, qa, extraSelector);
    fixture.queryAllByDataQa = (qa: string) => queryAllByDataQa(fixture.nativeElement, qa);
    fixture.queryAllByDataQaContains = (qa: string, extraSelector?: string) => queryAllByDataQaContains(fixture.nativeElement, qa, extraSelector);
    fixture.writeValueIntoInput = (element: HTMLInputElement, value: any) => {
        writeValueIntoInput(element, value);
        fixture.detectChanges();
        tick();
    };
    return fixture;
}
