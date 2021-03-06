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

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DialogService } from '../dialog/dialog.service';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

export interface ButtonConfig {
    label: string;
    style?: 'default' | 'danger' | 'primary';
    key: DialogResult;
}

export interface DialogConfig {
    title: string;
    message: string;
    buttons: ButtonConfig[];
    icon?: string;
    iconClass?: string;
}

export interface SimpleDialogConfig {
    title: string;
    message: string;
    okButtonLabel: string;
    cancelButtonLabel: string;
}

export type DialogResult = string;

@Injectable()
export class ConfirmationDialogService {
    constructor(
        private dialogService: DialogService
    ) { }

    openDialog(config: DialogConfig): Observable<DialogResult> {
        return this.dialogService.open<ConfirmationDialogComponent, DialogConfig, DialogResult>(
            ConfirmationDialogComponent,
            {
                width: '471px',
                height: '214px',
                data: config,
                autoFocus: false
            }
        ).afterClosed();
    }

    openAPIErrorDialog(message: string) {
        const config = {
            buttons: [{ key: 'close', label: 'Close' }],
            message: `Error: ${message}`,
            title: 'Something went wrong!',
            icon: 'error',
            iconClass: 'cfx-error'
        };
        this.openDialog(config);
    }
}
