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

import { Component, EventEmitter, Input, Output } from '@angular/core';


/**
 * A common dialog layout with header, body and footer
 * Header is configured by input params, see below.
 * Contents of body and footer are projected from the following child elements:
 * - <div body>
 * - <div footer-left>
 * - <div footer-right>
 */
@Component({
    selector: 'cfx-dialog-layout',
    templateUrl: './dialog-layout.component.html',
    styleUrls: ['./dialog-layout.component.scss']
})
export class DialogLayoutComponent {
    /** Main dialog title - use always with [] to avoid rendering a HTML title attribute
     * @example [title] = "'Demo'"
     */
    @Input() title: string;

    /** icon rendered in the top-left corner
     * @optional
     * @example icon = "error"
     * example will be rendered as <mat-icon svgIcon="cfx:error"></mat-icon>
     */
    @Input() icon: string;

    /** css class to apply to the icon - should be a class defined in a global css file
     * @optional
     * @example iconClass = "cfx-error"
     */
    @Input() iconClass: string;

    /**
     * Emits if the user clicks on the close icon on the top right corner
     * Parent component typically should call dialogRef.close()
     */
    @Output() close: EventEmitter<void> = new EventEmitter();
}
