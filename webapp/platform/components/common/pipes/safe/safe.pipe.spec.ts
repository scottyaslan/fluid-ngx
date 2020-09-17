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

import { DomSanitizer } from '@angular/platform-browser';
import { SafePipe } from './safe.pipe';

describe('Sanitize Pipe', () => {
    let pipe: SafePipe;
    const sanitizerMock: DomSanitizer = {
        bypassSecurityTrustHtml: jasmine.createSpy(),
        bypassSecurityTrustStyle: jasmine.createSpy(),
        bypassSecurityTrustScript: jasmine.createSpy(),
        bypassSecurityTrustUrl: jasmine.createSpy(),
        bypassSecurityTrustResourceUrl: jasmine.createSpy(),
        sanitize: jasmine.createSpy()
    };

    beforeEach(() => {
        pipe = new SafePipe(sanitizerMock);
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    describe('when transform is called with', () => {
        it('invalid type, then error has been thrown', () => {
            expect(() => pipe.transform('value', 'wrong type')).toThrowError();
        });

        it('html, then expected method has been called', () => {
            const input = '<div>test</div>';
            pipe.transform(input, 'html');
            expect(sanitizerMock.bypassSecurityTrustHtml).toHaveBeenCalledWith(input);
        });

        it('style, then expected method has been called', () => {
            const input = 'background-image: linear-gradient(to top, red 50%, blue);';
            pipe.transform(input, 'style');
            expect(sanitizerMock.bypassSecurityTrustStyle).toHaveBeenCalledWith(input);
        });

        it('script, then expected method has been called', () => {
            const input = '<script>test</script>';
            pipe.transform(input, 'script');
            expect(sanitizerMock.bypassSecurityTrustScript).toHaveBeenCalledWith(input);
        });

        it('url, then expected method has been called', () => {
            const input = 'http://test.com';
            pipe.transform(input, 'url');
            expect(sanitizerMock.bypassSecurityTrustUrl).toHaveBeenCalledWith(input);
        });

        it('resourceUrl, then expected method has been called', () => {
            const input = 'url(#test)';
            pipe.transform(input, 'resourceUrl');
            expect(sanitizerMock.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(input);
        });
    });
});
