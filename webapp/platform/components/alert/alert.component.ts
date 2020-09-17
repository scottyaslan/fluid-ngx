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

import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
} from '@angular/core';

export const AUTO_CLOSE_TIMEOUT = 5000;

@Component({
    selector: 'cfx-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertComponent implements OnInit {
    @Input() type: 'success' | 'warning' | 'info' | 'error' | 'unknown' = 'error';
    @Input() title: string = 'Error';
    @Input() size: 'small' | 'large' = 'small';
    @Input() closeable: boolean = false; // if set to true, alert will have a close button
    @Input() autoClose: boolean = false; // if set to true, will close automatically in AUTO_CLOSE_TIMEOUT ms
    @Output() close = new EventEmitter();

    private durationTimer;

    constructor() {
    }

    ngOnInit() {
        this.scheduleDismissAfterDuration();
    }

    ngDestroy() {
        clearTimeout(this.durationTimer);
    }

    over() {
        clearTimeout(this.durationTimer);
    }

    out() {
        this.scheduleDismissAfterDuration();
    }

    private scheduleDismissAfterDuration(): void {
        if (this.autoClose) {
            clearTimeout(this.durationTimer);
            this.durationTimer = setTimeout(() => this.close.emit(), AUTO_CLOSE_TIMEOUT);
        }
    }
}
