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

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SidebarItem } from 'cuix/dist/cdp/CDPSidebar.js';
import { IconsService } from 'webapp/platform';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
    selector: 'webapp',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    @ViewChild('sidenav', { static: false }) sidenavRef: MatSidenav;
    private componentDestroyed$ = new Subject();
    sidenavOpen = false;
    title: string = '';

    sidebarItems: SidebarItem[] = [
        {
            name: 'kitchensink',
            displayName: 'Fluid-ng-mat-X',
            iconClass: ' ',
            path: '/fluid-ng-mat-X',
            matcher: '#/fluid-ng-mat-X'
        }
    ];

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        iconsService: IconsService
    ) {
        iconsService.registerCfxIcons();
    }

    ngOnInit() {
        this.router.events
            .pipe(
                takeUntil(this.componentDestroyed$),
                filter((event) => event instanceof NavigationEnd)
            )
            .subscribe(() => {
                this.title = this.activatedRoute.snapshot.firstChild.data.title;
            });
    }

    sidebarOnNavigateHandler = (sidebarItem: SidebarItem): boolean => {
        this.router.navigate([sidebarItem.path]);
        return true;
    };

    ngOnDestroy() {
        if (!this.componentDestroyed$.isStopped) {
            this.componentDestroyed$.complete();
        }
    }

    closeSidenav() {
        this.sidenavRef.close();
    }
}
