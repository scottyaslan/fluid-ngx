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

import { Routes, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { NgZone } from '@angular/core';
import EmptyComponent from './empty-component';

/**
 * Creates a route map for testing, with no dependencies.
 * All components are replaced with EmptyComponent.
 */
export function mapToMockedRoutes(originalRoutes: Routes): Routes {
    return originalRoutes.map((originalRoute) => ({
        ...originalRoute,
        children: originalRoute.children ? mapToMockedRoutes(originalRoute.children) : undefined,
        component: originalRoute.component ? EmptyComponent : undefined
    }));
}

// issue: https://github.com/angular/angular/issues/25837
export function fixRouterInTests() {
    const router = TestBed.get(Router);
    if (router) {
        const originalInitialNavigation = router.initialNavigation;
        const originalNavigateByUrl = router.navigateByUrl;
        router.initialNavigation = (...options) => new NgZone({}).run(() => originalInitialNavigation.apply(router, options));
        router.navigateByUrl = (...options) => new NgZone({}).run(() => originalNavigateByUrl.apply(router, options));
    }
}
