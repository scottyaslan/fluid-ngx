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
import { delay, mergeMap } from 'rxjs/operators';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { cfxConfigureTestingModule, collectToArrayUntil } from 'webapp/testing/configureTestingModule';
import { Injectable } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { EmptyStoreMockModule } from 'webapp/testing/mocks/store';
import { ResourceManagerService } from '../resource-manager.service';
import { ResourceBase, ResourceError } from './resource-base';
import { ResourceEffectsService } from './resource-effects.service';

interface MyData { content: string; }
type GetParams = { id: number };

@Injectable()
class MyDataService extends ResourceBase<MyData> {
    constructor(
        resourceManagerService: ResourceManagerService,
        store: Store<any>
    ) {
        super('MyData', { content: null }, resourceManagerService, store);
    }

    get(params: GetParams): Observable<MyData> {
        const { id } = params;
        if (id === 1) {
            return of({ content: 'my data' }).pipe(delay(100));
        }
        return timer(100).pipe(mergeMap(() => throwError(new Error('Not found'))));
    }
}

describe('Resource service', () => {
    let myDataService: MyDataService;

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
                MyDataService
            ]
        });
        myDataService = TestBed.get(MyDataService);
    });

    it('should successfully load and clear', fakeAsync(() => {
        const destroy = new Subject();

        // Expects

        myDataService.resource$.pipe(collectToArrayUntil(destroy)).subscribe((results) => {
            expect(results).toEqual([
                { content: null }, // initial data
                { content: 'my data' }, // after load
                { content: null }, // after clear
            ]);
        });
        myDataService.loading$.pipe(collectToArrayUntil(destroy)).subscribe((results) => {
            expect(results).toEqual([false, true, false]); // should be true only while loading
        });
        myDataService.error$.pipe(collectToArrayUntil(destroy)).subscribe((results) => {
            expect(results).toEqual([null]); // no errors
        });

        // Actions

        myDataService.load({ id: 1 }); // loading existing data, takes 100ms
        tick(200); // ... after loaded ...
        myDataService.clear();
        tick();
        destroy.next(); // end of session, run expects
    }));

    it('should handle error', fakeAsync(() => {
        const destroy = new Subject();

        // Expects

        myDataService.resource$.pipe(collectToArrayUntil(destroy)).subscribe((results) => {
            expect(results).toEqual([
                { content: null }, // always null, no successful load
            ]);
        });
        myDataService.loading$.pipe(collectToArrayUntil(destroy)).subscribe((results) => {
            expect(results).toEqual([false, true, false]); // should be true only while loading
        });
        myDataService.error$.pipe(collectToArrayUntil(destroy)).subscribe((results) => {
            const messages = results.map((error: ResourceError) => (error ? error.message : null));
            expect(messages).toEqual([
                null, // initial state
                'Not found', // error
                null // after clear
            ]);
        });

        // Actions

        myDataService.load({ id: 2 }); // loading missing data, takes 100ms
        tick(200); // ... after loaded ...
        myDataService.clear(); // clearing error
        tick();
        destroy.next(); // end of session, run expects
    }));

    it('should provide a snapshot after a successful load', fakeAsync(() => {
        myDataService.load({ id: 1 }); // loading existing data, takes 100ms
        expect(myDataService.getSnapshot()).toEqual({ content: null }); // initial state

        tick(200); // ... after loaded ...
        expect(myDataService.getSnapshot()).toEqual({ content: 'my data' });
    }));

    it('should provide initial state as a snapshot after an error', fakeAsync(() => {
        myDataService.load({ id: 1 }); // loading existing data, takes 100ms
        tick(200); // ... after loaded ...
        expect(myDataService.getSnapshot()).toEqual({ content: 'my data' });

        myDataService.load({ id: 2 }); // loading missing data, takes 100ms
        tick(200); // ... after loaded ...
        expect(myDataService.getSnapshot()).toEqual({ content: null });
    }));

    it('should provide initial state as a snapshot after clear', fakeAsync(() => {
        myDataService.load({ id: 1 }); // loading existing data, takes 100ms
        tick(200); // ... after loaded ...
        expect(myDataService.getSnapshot()).toEqual({ content: 'my data' });

        myDataService.clear();
        expect(myDataService.getSnapshot()).toEqual({ content: null });
    }));
});
