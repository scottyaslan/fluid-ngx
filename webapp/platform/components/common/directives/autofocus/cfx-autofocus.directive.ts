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

import { Directive, ElementRef, Input, NgZone } from '@angular/core';
import { take } from 'rxjs/operators';

@Directive({
    selector: '[cfxAutofocus]'
})
export class CfxAutofocusDirective {
    private shouldFocus: boolean;

    /**
     * To save implementing other angular lifecycle hooks this setter handles
     * initial value
     * value change
     */
    @Input() set cfxAutofocus(condition: boolean) {
        this.shouldFocus = condition !== false;
        this.setFocus();
    }

    constructor(private elementRef: ElementRef, private ngZone: NgZone) { }

    /**
     * Waits for the zone to stabilize, then either focuses the first element that the user specified
     * based on material focusInitialElementWhenReady() function
     * https://github.com/angular/components/blob/master/src/cdk/a11y/focus-trap/focus-trap.ts#L136
     */
    private setFocus() {
        if (this.shouldFocus || typeof this.shouldFocus === 'undefined') {
            if (this.ngZone.isStable) {
                if (this.elementRef && this.elementRef.nativeElement) {
                    this.elementRef.nativeElement.focus();
                }
            } else {
                this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
                    if (this.elementRef && this.elementRef.nativeElement) {
                        this.elementRef.nativeElement.focus();
                    }
                });
            }
        }
    }
}
