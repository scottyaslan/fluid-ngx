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

import { TestBed, TestModuleMetadata, TestBedStatic } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule, MatIcon } from '@angular/material';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { pipe } from 'rxjs';
import { takeUntil, toArray } from 'rxjs/operators';

import { DirectivesModule } from 'webapp/platform/components/common/directives/directives.module';
import { CfxAutofocusDirective } from 'webapp/platform/components/common/directives/autofocus/cfx-autofocus.directive';
import MockMatIconComponent from './mocks/mat-icon';
import MockAutofocusDirective from './mocks/autofocus';

// configures Testbed for the platform
// WITHOUT routing and mock interceptor
export function cfxConfigureTestingModule(moduleDef: TestModuleMetadata): TestBedStatic {
    return TestBed.configureTestingModule({
        ...moduleDef,
        declarations: [
            ...moduleDef.declarations || []
        ],
        providers: [
            ...moduleDef.providers || [],
            {
                provide: HAMMER_LOADER,
                useValue: () => new Promise(() => { })
            }
        ],
        imports: [
            ...moduleDef.imports || [],
            DirectivesModule,
            MatIconModule,
            NoopAnimationsModule
        ]
    }).overrideModule(MatIconModule, {
        remove: {
            declarations: [MatIcon],
            exports: [MatIcon]
        },
        add: {
            declarations: [MockMatIconComponent],
            exports: [MockMatIconComponent]
        }
    }).overrideModule(DirectivesModule, {
        remove: {
            declarations: [CfxAutofocusDirective],
            exports: [CfxAutofocusDirective]
        },
        add: {
            declarations: [MockAutofocusDirective],
            exports: [MockAutofocusDirective]
        }
    });
}

// collectToArrayUntil operator waits for destroy and then provides all results as an array
// Usage example:
//
//   const destroy = new Subject();
//   myCollectionService.entities$.pipe(collectToArrayUntil(destroy)).subscribe((results) => {
//            expect(results).toEqual([
//                [], // initial data
//                [{ id: 'pig' }, { id: 'lemming' }], // after load,
//                ... other results ...
//            ]);
//   });
//
//   myCollectionService.load({ type: 'animals' }); // loading existing data, takes 100ms
//   tick(100);
//   ... other actions ...
//   destroy.next(); // end of session, run expects

export const collectToArrayUntil = (destroy) => pipe(
    takeUntil(destroy),
    toArray()
);
