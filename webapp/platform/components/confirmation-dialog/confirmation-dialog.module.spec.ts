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

import { CfxComponentFixture, cfxCreateComponent, queryByDataQa, queryAllByDataQa } from 'webapp/testing/createComponent';
import EmptyComponent from 'webapp/testing/mocks/empty-component';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { cfxConfigureTestingModule } from 'webapp/testing/configureTestingModule';
import { take } from 'rxjs/operators';
import { ConfirmationDialogService, DialogConfig, DialogResult } from './confirmation-dialog.service';
import { ConfirmationDialogModule } from './confirmation-dialog.module';

describe('ConfirmationDialogService', () => {
    let confirmationDialogService: ConfirmationDialogService;
    let fixture: CfxComponentFixture<EmptyComponent>;
    let dialogResult: DialogResult;

    const myDialogConfig: DialogConfig = {
        title: 'My title',
        message: 'My message',
        buttons: [{
            label: 'Button 1',
            key: 'BUTTON_1'
        }, {
            label: 'Button 2',
            style: 'primary',
            key: 'BUTTON_2'
        }, {
            label: 'Button 3',
            style: 'danger',
            key: 'BUTTON_3'
        }]
    };

    //query by data-qa on document
    const query = (q) => queryByDataQa((document as any), q);
    const queryAll = (q) => queryAllByDataQa((document as any), q);

    beforeEach(fakeAsync(() => {
        cfxConfigureTestingModule({
            declarations: [EmptyComponent],
            imports: [ConfirmationDialogModule],
        })
            .compileComponents();
    }));

    beforeEach(fakeAsync(() => {
        fixture = cfxCreateComponent<EmptyComponent>(EmptyComponent);
        confirmationDialogService = TestBed.get(ConfirmationDialogService);

        dialogResult = null;
        confirmationDialogService.openDialog(myDialogConfig).pipe(take(1)).subscribe(
            (result) => { dialogResult = result; }
        );

        tick();
        fixture.detectChanges();
    }));

    it('should have appropriate texts', fakeAsync(() => {
        expect(query('dialog-title').innerText)
            .toBe('My title', 'Title should match');
        expect(query('dialog-body').innerText)
            .toBe('My message', 'Message should match');
    }));

    it('should have appropriate buttons', fakeAsync(() => {
        const buttons = queryAll('confirm-dialog-button');
        const buttonClasses = (i) => buttons[i].className.split(' ').filter((c) => !c.startsWith('ng-'));

        expect(buttons[0].innerText).toBe('Button 1', 'Button 1 label should match');
        expect(buttonClasses(0)).toEqual(['cfx-btn'], 'Button 1 classes should match');
        expect(buttons[1].innerText).toBe('Button 2', 'Button 2 label should match');
        expect(buttonClasses(1)).toEqual(['cfx-btn', 'btn-primary'], 'Button 2 classes should match');
        expect(buttons[2].innerText).toBe('Button 3', 'Button 3 label should match');
        expect(buttonClasses(2)).toEqual(['cfx-btn', 'btn-danger'], 'Button 3 classes should match');
    }));

    it('should return the selected button key', fakeAsync(() => {
        queryAll('confirm-dialog-button')[0].click();
        tick(500); // wait for the closing animation

        expect(dialogResult).toBe('BUTTON_1');
    }));

    it('should close', fakeAsync(() => {
        query('dialog-close').click();
        fixture.detectChanges();
        tick(500); // wait for the closing animation
        expect(dialogResult).toBe('CLOSE');
    }));
});
