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

import { TestBed } from '@angular/core/testing';
import { cfxConfigureTestingModule } from 'webapp/testing/configureTestingModule';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

import { IconsService } from './icons.service';
import icons from '../../../assets/cdp-icons/icons.json';

describe('IconsService', () => {
    class IconRegistryStub {
        addSvgIconInNamespace() { }
    }
    class DomSanitizerStub {
        bypassSecurityTrustResourceUrl() { }
    }

    beforeEach(() => cfxConfigureTestingModule({
        providers: [
            IconsService,
            { provide: MatIconRegistry, useClass: IconRegistryStub },
            { provide: DomSanitizer, useClass: DomSanitizerStub }
        ]
    }));

    it('should be created', () => {
        const service: IconsService = TestBed.get(IconsService);
        expect(service).toBeTruthy();
    });

    describe('when registerCfxIcons is called, then', () => {
        let service: IconsService;
        let iconRegistryStub: MatIconRegistry;
        let domSanitizerStub: DomSanitizer;

        beforeEach(() => {
            service = TestBed.get(IconsService);
            iconRegistryStub = TestBed.get(MatIconRegistry);
            domSanitizerStub = TestBed.get(DomSanitizer);

            spyOn(iconRegistryStub, 'addSvgIconInNamespace');
            spyOn(domSanitizerStub, 'bypassSecurityTrustResourceUrl');

            service.registerCfxIcons();
        });

        it('MatIconRegistry should be called for each icon', () => {
            expect(iconRegistryStub.addSvgIconInNamespace).toHaveBeenCalledTimes(icons.length);
        });

        it('DomSanitizer should be called for each icon', () => {
            expect(domSanitizerStub.bypassSecurityTrustResourceUrl).toHaveBeenCalledTimes(icons.length);
        });
    });
});
