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

import { Store } from '@ngrx/store';
import { Observable, of, Subject, throwError, timer } from 'rxjs';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { cfxConfigureTestingModule, collectToArrayUntil } from 'webapp/testing/configureTestingModule';
import { Injectable } from '@angular/core';
import { delay, mergeMap } from 'rxjs/operators';
import { EffectsModule } from '@ngrx/effects';
import { EmptyStoreMockModule } from 'webapp/testing/mocks/store';
import { ResourceManagerService } from '../../resource-manager.service';
import { ResourceEffectsService } from '../resource-effects.service';
import { CollectionResourceBase, CollectionState } from './collection-base';
import { ResourceError } from '../resource-base';

type MyData = { id: string };
type GetParams = { type: 'animals' | 'plants' };

@Injectable()
class MyCollectionService extends CollectionResourceBase<MyData> {
    constructor(
        resourceManagerService: ResourceManagerService,
        store: Store<any>
    ) {
        super('MyCollection', resourceManagerService, store);
    }

    get({ type }: GetParams): Observable<CollectionState<MyData>> {
        if (type === 'animals') {
            return of({ elements: [{ id: 'pig' }, { id: 'lemming' }], page: { totalElements: 2 } }).pipe(delay(100));
        }
        return timer(100).pipe(mergeMap(() => throwError(new Error('Not found'))));
    }
}

describe('Collection service', () => {
    let myCollectionService: MyCollectionService;

    beforeEach(() => {
        cfxConfigureTestingModule({
            imports: [
                EmptyStoreMockModule,
                EffectsModule.forRoot([
                    ResourceEffectsService
                ]),
            ],
            providers: [
                ResourceManagerService,
                MyCollectionService
            ]
        });
        myCollectionService = TestBed.get(MyCollectionService);
    });

    it('should successfully load and clear', fakeAsync(() => {
        const destroy = new Subject();

        // Expects

        myCollectionService.entities$.pipe(collectToArrayUntil(destroy)).subscribe((results) => {
            expect(results).toEqual([
                [], // initial data
                [{ id: 'pig' }, { id: 'lemming' }], // after load
                [], // after clear
            ]);
        });
        myCollectionService.loading$.pipe(collectToArrayUntil(destroy)).subscribe((results) => {
            expect(results).toEqual([false, true, false]); // should be true only while loading
        });
        myCollectionService.error$.pipe(collectToArrayUntil(destroy)).subscribe((results) => {
            expect(results).toEqual([null]); // no errors
        });

        // Actions

        myCollectionService.load({ type: 'animals' }); // loading existing data, takes 100ms
        tick(200); // ... after loaded ...
        myCollectionService.clear();
        tick();
        destroy.next(); // end of session, run expects
    }));

    it('should handle error', fakeAsync(() => {
        const destroy = new Subject();

        // Expects

        myCollectionService.entities$.pipe(collectToArrayUntil(destroy)).subscribe((results) => {
            expect(results).toEqual([
                [], // always null, no successful load
            ]);
        });
        myCollectionService.loading$.pipe(collectToArrayUntil(destroy)).subscribe((results) => {
            expect(results).toEqual([false, true, false]); // should be true only while loading
        });
        myCollectionService.error$.pipe(collectToArrayUntil(destroy)).subscribe((results) => {
            const messages = results.map((error: ResourceError) => (error ? error.message : null));
            expect(messages).toEqual([
                null, // initial state
                'Not found', // error
                null // after clear
            ]);
        });

        // Actions

        myCollectionService.load({ type: 'plants' }); // loading missing data, takes 100ms
        tick(200); // ... after loaded ...
        myCollectionService.clear(); // clearing error
        tick();
        destroy.next(); // end of session, run expects
    }));
});
