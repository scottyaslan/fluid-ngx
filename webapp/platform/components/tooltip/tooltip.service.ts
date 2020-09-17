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

import { Injectable, ElementRef, Injector } from '@angular/core';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { OverlayContainerComponent, TooltipContent, CFX_TOOLTIP_DATA, TooltipData } from './overlay-container/overlay-container.component';

@Injectable({
    providedIn: 'root'
})
export class TooltipService {
    private overlayRef: OverlayRef;

    constructor(
        private overlay: Overlay,
        private injector: Injector
    ) { }

    show(anchorElement: ElementRef, content: TooltipContent) {
        this.hide();
        this.overlayRef = this.overlay.create({
            positionStrategy: this.overlay
                .position()
                .flexibleConnectedTo(anchorElement)
                .withPositions([{
                    overlayX: 'start',
                    overlayY: 'top',
                    originX: 'start',
                    originY: 'top'
                }])
                .withPush()
                .withViewportMargin(30),
            scrollStrategy: this.overlay.scrollStrategies.close(),
            hasBackdrop: false,
            backdropClass: 'info-backdrop'
        });

        const tooltipData: TooltipData = {
            content,
            hideOverlay: () => this.hide()
        };

        const injectorTokens = new WeakMap();
        injectorTokens.set(CFX_TOOLTIP_DATA, tooltipData);
        const portal = new ComponentPortal(OverlayContainerComponent, null, new PortalInjector(this.injector, injectorTokens));
        this.overlayRef.attach(portal);
    }

    hide() {
        if (this.overlayRef) {
            this.overlayRef.detach();
            this.overlayRef.dispose();
            this.overlayRef = null;
        }
    }
}
