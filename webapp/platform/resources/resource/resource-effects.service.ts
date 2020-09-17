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

import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { createEffect, Actions } from '@ngrx/effects';
import { map, mergeMap, catchError, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { ResourceMetadata } from './resource-base';
import { ResourceManagerService } from '../resource-manager.service';

export interface LoadAction extends Action {
    params: any;
}
@Injectable()
export class ResourceEffectsService {
    constructor(
        private actions$: Actions,
        private resourceManagerService: ResourceManagerService
    ) { }

    /**
     * An effect that reacts on any 'load'  actions
     * It calls the get() method of the resource service
     */
    loadEffect$ = createEffect(() => this.actions$.pipe(
        map((action: LoadAction) => {
            const resourceMetadata = this.resourceManagerService.resources.find((r: ResourceMetadata<any>) => (
                r.actions.load && action.type === r.actions.load.type
            )) as ResourceMetadata<any>;
            return { action, resourceMetadata };
        }),
        filter(({ resourceMetadata }) => !!resourceMetadata),
        mergeMap(({ action, resourceMetadata }) => resourceMetadata.queries.get(action.params).pipe(
            map((data) => resourceMetadata.actions.loadSuccess({ data, action })),
            catchError((error) => of(resourceMetadata.actions.loadError(
                {
                    status: error.status,
                    message: error.message
                }
            )))
        ))
    ));
}
