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

import { fakeAsync, tick } from '@angular/core/testing';

import { cfxCreateComponent, queryByDataQa, CfxComponentFixture } from 'webapp/testing/createComponent';
import { cfxConfigureTestingModule } from 'webapp/testing/configureTestingModule';
import { Component, ViewChild } from '@angular/core';
import { TooltipModule } from './tooltip.module';

/**
 * Tests for tooltip module, including directive, service and components
 */

// Test components

@Component({
    template: `<cfx-tooltip-help-button [text]="tooltipText"
                                        [title]="tooltipTitle"
                                        [link]="tooltipLink"
                                        #tooltipHelpButton>
               </cfx-tooltip-help-button>`
})
export class TooltipFromHelpButton {
    @ViewChild('tooltipHelpButton', { static: false }) tooltipHelpButton;
    tooltipText = 'More info.';
    tooltipTitle = '';
    tooltipLink = '';
}

@Component({
    template: `
    <cfx-tooltip-help-button title="Help title"
                             text="Help text"
                             link='http://cloudera.com'>
    </cfx-tooltip-help-button>`
})
export class TooltipHelpWithTitleTextAndLink { }

@Component({
    template: '<a href="#" data-qa="test-help-button" cfxTooltip="More info.">Help</a>'
})
export class LargeTooltipWithTextOnly { }

@Component({
    template: `
        <a href="#" data-qa="test-help-button" [cfxTooltip]="tooltipTemplate"> Help </a>
        <ng-template #tooltipTemplate>
            <div>More formatted info.</div>
        </ng-template>
    `
})
export class LargeTooltipWithRichCustomContent { }

// Helpers

const hoverOnTooltipButton = (q) => {
    queryByDataQa(document as any, q)
        .dispatchEvent(new MouseEvent('mouseenter'));
    tick();
};
const getTooltipContent = () => queryByDataQa(document as any, 'tooltip-overlay-container');
const leaveTooltipArea = () => {
    document
        .querySelector('cfx-overlay-container')
        .dispatchEvent(new MouseEvent('mouseleave'));
    tick();
};

// Tests

describe('TooltipModule', () => {
    beforeEach(fakeAsync(() => {
        cfxConfigureTestingModule({
            imports: [TooltipModule],
            declarations: [
                TooltipFromHelpButton,
                TooltipHelpWithTitleTextAndLink,
                LargeTooltipWithTextOnly,
                LargeTooltipWithRichCustomContent
            ]
        })
            .compileComponents();
    }));

    describe('Tooltip from help button', () => {
        let fixture: CfxComponentFixture<TooltipFromHelpButton>;
        let component: TooltipFromHelpButton;

        beforeEach(fakeAsync(() => {
            fixture = cfxCreateComponent(TooltipFromHelpButton);
            fixture.detectChanges();
            component = fixture.componentInstance;
        }));

        it('should show and hide tooltip', fakeAsync(() => {
            hoverOnTooltipButton('tooltip-help-button');
            expect(getTooltipContent().innerText).toEqual('More info.');
            leaveTooltipArea();
            expect(getTooltipContent()).toBeFalsy();
        }));

        describe('should update context', () => {
            it('after text change', () => {
                component.tooltipText = 'new text';
                fixture.detectChanges();

                expect(component.tooltipHelpButton.tooltipContext.text).toBe('new text');
            });
            it('after title change', () => {
                component.tooltipTitle = 'new title';
                fixture.detectChanges();

                expect(component.tooltipHelpButton.tooltipContext.title).toBe('new title');
            });
            it('after link change', () => {
                component.tooltipLink = 'new link';
                fixture.detectChanges();

                expect(component.tooltipHelpButton.tooltipContext.link).toBe('new link');
            });
        });
    });

    describe('Tooltip help with title, text & link', () => {
        beforeEach(fakeAsync(() => {
            cfxCreateComponent(TooltipHelpWithTitleTextAndLink)
                .detectChanges();
        }));

        it('should show and hide tooltip', fakeAsync(() => {
            hoverOnTooltipButton('tooltip-help-button');

            const tooltip = getTooltipContent();

            expect(queryByDataQa(tooltip, 'tooltip-help-title').innerText).toEqual('Help title');
            expect(queryByDataQa(tooltip, 'tooltip-help-text').innerText).toEqual('Help text');
            expect(queryByDataQa(tooltip, 'tooltip-help-link').innerText).toEqual('See further documentation');
            expect(queryByDataQa(tooltip, 'tooltip-help-link').getAttribute('href')).toEqual('http://cloudera.com');

            leaveTooltipArea();
            expect(getTooltipContent()).toBeFalsy();
        }));
    });

    describe('Large tooltip with text only', () => {
        beforeEach(fakeAsync(() => {
            cfxCreateComponent(LargeTooltipWithTextOnly)
                .detectChanges();
        }));

        it('should show and hide tooltip', fakeAsync(() => {
            hoverOnTooltipButton('test-help-button');
            expect(getTooltipContent().innerText).toEqual('More info.');
            leaveTooltipArea();
            expect(getTooltipContent()).toBeFalsy();
        }));
    });

    describe('Large tooltip with rich custom content', () => {
        beforeEach(fakeAsync(() => {
            cfxCreateComponent(LargeTooltipWithRichCustomContent)
                .detectChanges();
        }));

        it('should show and hide tooltip', fakeAsync(() => {
            hoverOnTooltipButton('test-help-button');
            expect(getTooltipContent().innerText).toEqual('More formatted info.');
            leaveTooltipArea();
            expect(getTooltipContent()).toBeFalsy();
        }));
    });
});
