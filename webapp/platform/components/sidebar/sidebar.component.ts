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

import { AfterViewInit, Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, RouterEvent, NavigationEnd } from '@angular/router';
import { map, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import CDPSidebar, { SidebarItem } from 'cuix/dist/cdp/CDPSidebar.js';
import variables from 'cuix/dist/styles/variables';

@Component({
    selector: 'cfx-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements AfterViewInit {
    @Input() sidebarItems: SidebarItem[];
    @Input() backgroundGradient: string;
    @Input() onNavigateHandler: (itemData: SidebarItem) => boolean;

    @ViewChild('sidebarContainer', { static: true }) sidebarContainerRef: ElementRef;

    private sidebar = new CDPSidebar();
    private helpTopic$: Observable<string>;

    constructor(private router: Router, private route: ActivatedRoute) { }

    ngAfterViewInit() {
        this.sidebar.render({
            parent: this.sidebarContainerRef.nativeElement,
            sidebarItems: this.sidebarItems,
            showAppSwitcher: true,
            productColor: variables.cuiGreen700,
            productLogo: './platform/assets/cdp-icons/ic-product-data-flow-lg.svg',
            companyLogo: './platform/assets/custom-icons/wordmark-data-hub.svg',
            // UPDATE: using user object from input... works on cloud environments
            // user: {
            //     firstName: 'Stephen Hawking',
            //     crn: '',
            //     lastName: '',
            //     email: '',
            //     userId: 'sh123',
            //     creationDate: '',
            //     accountAdmin: false,
            //     identityProviderCrn: ''
            // },
            helpTopic: '',
            onNavigate: (sidebarItem: SidebarItem) => this.onNavigateHandler(sidebarItem)
        });

        this.helpTopic$ = this.router.events.pipe(
            filter((event: RouterEvent) => event instanceof NavigationEnd),
            tap(() => { this.sidebar.update(); }),
            map(() => {
                let child = this.route.firstChild;
                let topic = '';
                while (child) {
                    if (child.snapshot && child.snapshot.data.helpTopic) {
                        topic = child.snapshot.data.helpTopic;
                    }
                    if (child.firstChild) {
                        child = child.firstChild;
                    } else {
                        return topic;
                    }
                }
                return topic;
            }),
            distinctUntilChanged()
        );

        combineLatest(
            this.helpTopic$
        ).subscribe(([helpTopic]) => {
            this.sidebar.setHelpTopic(helpTopic);
        });
    }
}
