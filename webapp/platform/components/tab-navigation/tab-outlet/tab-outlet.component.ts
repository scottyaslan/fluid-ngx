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

import { Component } from '@angular/core';
import { query, trigger, transition, style, animateChild, group, animate } from '@angular/animations';
import { RouterOutlet } from '@angular/router';

/*
 * A simple router outlet with slide animations
 */

@Component({
    selector: 'cfx-tab-outlet',
    templateUrl: './tab-outlet.component.html',
    styleUrls: ['./tab-outlet.component.scss'],
    animations: [
        trigger('slideAnimationByIndex', [
            transition(':decrement', [
                style({ position: 'relative' }),
                query(':enter, :leave', [
                    style({
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%'
                    })
                ]),
                query(':enter', [
                    style({ left: '-100%' })
                ]),
                query(':leave', animateChild()),
                group([
                    query(':leave', [
                        animate('200ms ease-out', style({ left: '100%' }))
                    ]),
                    query(':enter', [
                        animate('300ms ease-out', style({ left: '0%' }))
                    ])
                ]),
                query(':enter', animateChild()),
            ]),
            transition(':increment', [
                style({ position: 'relative' }),
                query(':enter, :leave', [
                    style({
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%'
                    })
                ]),
                query(':enter', [
                    style({ left: '100%' })
                ]),
                query(':leave', animateChild()),
                group([
                    query(':leave', [
                        animate('200ms ease-out', style({ left: '-100%' }))
                    ]),
                    query(':enter', [
                        animate('300ms ease-out', style({ left: '0%' }))
                    ])
                ]),
                query(':enter', animateChild()),
            ])
        ]),
    ],
})
export class TabOutletComponent {
    constructor() { }

    // get index of the current tab child route
    // to determine the direction of the slide animation
    getChildRouteIndex(outlet: RouterOutlet) {
        if (outlet && outlet.isActivated) {
            const currentRoute = outlet.activatedRoute;
            if (currentRoute && currentRoute.routeConfig) {
                const { parent } = currentRoute;
                if (parent && parent.routeConfig) {
                    const indexOfCurrentRoute = parent.routeConfig.children.findIndex(
                        (child) => child.path === currentRoute.routeConfig.path
                    );
                    return indexOfCurrentRoute + 1; // one based index - 0 for not found
                }
            }
        }
        return false;
    }
}
