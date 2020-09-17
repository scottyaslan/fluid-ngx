/*
 *  (c) 2018-2020 Cloudera, Inc. All rights reserved.
 *
 *    This code is provided to you pursuant to your written agreement with Cloudera, which may be the terms of the
 *   Affero General Public License version 3 (AGPLv3), or pursuant to a written agreement with a third party authorized
 *   to distribute this code.  If you do not have a written agreement with Cloudera or with an authorized and
 *   properly licensed third party, you do not have any rights to this code.
 *
 *    If this code is provided to you under the terms of the AGPLv3:
 *    (A) CLOUDERA PROVIDES THIS CODE TO YOU WITHOUT WARRANTIES OF ANY KIND;
 *    (B) CLOUDERA DISCLAIMS ANY AND ALL EXPRESS AND IMPLIED WARRANTIES WITH RESPECT TO THIS CODE, INCLUDING BUT NOT
 *        LIMITED TO IMPLIED WARRANTIES OF TITLE, NON-INFRINGEMENT, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE;
 *    (C) CLOUDERA IS NOT LIABLE TO YOU, AND WILL NOT DEFEND, INDEMNIFY, OR HOLD YOU HARMLESS FOR ANY CLAIMS ARISING
 *        FROM OR RELATED TO THE CODE; AND
 *    (D) WITH RESPECT TO YOUR EXERCISE OF ANY RIGHTS GRANTED TO YOU FOR THE CODE, CLOUDERA IS NOT LIABLE FOR ANY
 *        DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, PUNITIVE OR CONSEQUENTIAL DAMAGES INCLUDING, BUT NOT LIMITED
 *        TO, DAMAGES RELATED TO LOST REVENUE, LOST PROFITS, LOSS OF INCOME, LOSS OF BUSINESS ADVANTAGE OR
 *        UNAVAILABILITY, OR LOSS OR CORRUPTION OF DATA.
 *
 */

import { Location } from '@angular/common';
import { TestBed, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { cfxConfigureTestingModule } from 'webapp/testing/configureTestingModule';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { fixRouterInTests } from 'webapp/testing/mocks/routing';
import { TabNavigationModule } from './tab-navigation.module';

// Test template

@Component({ template: '<h1>Tab 1</h1>' })
export class Tab1Component { }

@Component({ template: '<h1>Tab 2</h1>' })
export class Tab2Component { }

@Component({
    template: `
    <cfx-tab-nav>
        <cfx-tab-link route="tab1">Link 1</cfx-tab-link>
        <cfx-tab-link route="tab2">Link 2</cfx-tab-link>
    </cfx-tab-nav>
    <cfx-tab-outlet></cfx-tab-outlet>
` })
export class TabNavigationTestComponent { }

describe('Tab Navigation', () => {
    let location: Location;
    let router: Router;
    let fixture: ComponentFixture<TabNavigationTestComponent>;

    // helpers
    const getTabContent = () => fixture.debugElement.query(By.css('h1')).nativeElement.innerText;
    const getActiveLink = () => fixture.debugElement.query(By.css('a.mat-tab-label-active')).nativeElement.innerText;
    const clickTab = (index) => fixture.debugElement.query(By.css(`a:nth-child(${index})`)).nativeElement.click();

    beforeEach(fakeAsync(() => {
        cfxConfigureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([
                    { path: '', pathMatch: 'full', redirectTo: 'tab1' },
                    {
                        path: 'tab1',
                        component: Tab1Component
                    },
                    {
                        path: 'tab2',
                        component: Tab2Component
                    }
                ]),
                TabNavigationModule
            ],
            declarations: [
                Tab1Component,
                Tab2Component,
                TabNavigationTestComponent
            ]
        }).compileComponents();

        // issue: https://github.com/angular/angular/issues/25837
        fixRouterInTests();

        router = TestBed.get(Router);
        location = TestBed.get(Location);
    }));

    beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(TabNavigationTestComponent);
        fixture.detectChanges();

        router.initialNavigation();
        tick();
        fixture.detectChanges();
    }));

    describe('should handle initial navigation', () => {
        it('location should match', fakeAsync(() => { expect(location.path()).toBe('/tab1'); }));
        it('tab content should match', fakeAsync(() => { expect(getTabContent()).toBe('Tab 1'); }));
        it('active link should match', fakeAsync(() => { expect(getActiveLink()).toBe('Link 1'); }));
    });

    describe('should navigate to other tab by clicking the tab link', () => {
        beforeEach(fakeAsync(() => {
            clickTab(2);
            tick();
            fixture.detectChanges();
        }));
        it('location should match', () => { expect(location.path()).toBe('/tab2'); });
        it('tab content should match', () => { expect(getTabContent()).toBe('Tab 2'); });
        it('active link should match', () => { expect(getActiveLink()).toBe('Link 2'); });
    });

    describe('should navigate to other tab by navigation', () => {
        beforeEach(fakeAsync(() => {
            router.navigate(['/tab2']);
            tick();
            fixture.detectChanges();
        }));
        it('location should match', () => { expect(location.path()).toBe('/tab2'); });
        it('tab content should match', () => { expect(getTabContent()).toBe('Tab 2'); });
        it('active link should match', () => { expect(getActiveLink()).toBe('Link 2'); });
    });
});
