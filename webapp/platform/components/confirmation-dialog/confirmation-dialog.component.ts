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

import { Component, Inject, AfterViewInit, ViewChildren, ElementRef, QueryList, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogResult, DialogConfig, ButtonConfig } from './confirmation-dialog.service';

export const CLOSE_BUTTON: DialogResult = 'CLOSE';

@Component({
    selector: 'cfx-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit, AfterViewInit {
    @ViewChildren('buttons') buttons: QueryList<ElementRef>;

    constructor(
        private dialogRef: MatDialogRef<ConfirmationDialogComponent, DialogResult>,
        @Inject(MAT_DIALOG_DATA) public config: DialogConfig
    ) { }

    ngOnInit(): void {
        this.dialogRef.keydownEvents().subscribe((event) => {
            if (event.key === 'Escape') {
                this.close();
            }
        });
    }

    ngAfterViewInit(): void {
        this.buttons.last.nativeElement.focus();
    }

    getButtonStyle = (button: ButtonConfig) => ({
        'cfx-btn': true,
        'btn-primary': button.style === 'primary',
        'btn-danger': button.style === 'danger'
    });

    close() {
        this.dialogRef.close(CLOSE_BUTTON);
    }

    clickButton(button: ButtonConfig) {
        this.dialogRef.close(button.key);
    }
}
