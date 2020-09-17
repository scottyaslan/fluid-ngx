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

import { Component, HostListener, TemplateRef, Inject, InjectionToken } from '@angular/core';

export const CFX_TOOLTIP_DATA = new InjectionToken<{}>('CFX_TOOLTIP_DATA');

export type TooltipContent = string | TemplateRef<any> | {
    template: TemplateRef<any>,
    context: any
};

export interface TooltipData {
    content: TooltipContent;
    hideOverlay: () => void;
}

@Component({
    selector: 'cfx-overlay-container',
    templateUrl: './overlay-container.component.html',
    styleUrls: ['./overlay-container.component.scss']
})
export class OverlayContainerComponent {
    template: TemplateRef<any>;
    context: any;
    plainText: string;

    @HostListener('mouseleave') onMouseLeave() {
        this.tooltipData.hideOverlay();
    }

    constructor(
        @Inject(CFX_TOOLTIP_DATA) private tooltipData: TooltipData
    ) {
        const { content } = this.tooltipData;
        if (typeof content === 'string') {
            this.plainText = content;
        } else if (content instanceof TemplateRef) {
            this.template = content;
        } else if (content.template && content.context) {
            this.template = content.template;
            this.context = content.context;
        }
    }
}
