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

import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { DialogConfig, ConfirmationDialogService } from 'webapp/platform/components/confirmation-dialog/confirmation-dialog.service';
import { FilePickerEvent } from '../../platform/components/file-picker/file-picker.component';

@Component({
    templateUrl: './fluid-ng-mat-x.component.html',
    styleUrls: ['./fluid-ng-mat-x.component.scss']
})
export class FluidNgMatXComponent {
    @ViewChild('fileNamesTextarea', { static: true }) fileNamesTextareaRef: ElementRef;

    steps: Array<any> = ([
        {
            text: 'Step 1 (Completed)',
            completed: true
        },
        {
            text: 'Step 2 (Disabled)',
            disabled: true
        },
        {
            text: 'Step 3 (Active)',
            active: true
        },
        {
            text: 'Step 4'
        }
    ]);

    //<editor-fold desc='Autocomplete'>

    currentState = '';
    filteredStates = [];
    states = [
        { code: 'AL', name: 'Alabama' },
        { code: 'AK', name: 'Alaska' },
        { code: 'AZ', name: 'Arizona' },
        { code: 'AR', name: 'Arkansas' },
        { code: 'CA', name: 'California' },
        { code: 'CO', name: 'Colorado' },
        { code: 'CT', name: 'Connecticut' },
        { code: 'DE', name: 'Delaware' },
        { code: 'FL', name: 'Florida' },
        { code: 'GA', name: 'Georgia' },
        { code: 'HI', name: 'Hawaii' },
        { code: 'ID', name: 'Idaho' },
        { code: 'IL', name: 'Illinois' },
        { code: 'IN', name: 'Indiana' },
        { code: 'IA', name: 'Iowa' },
        { code: 'KS', name: 'Kansas' },
        { code: 'KY', name: 'Kentucky' },
        { code: 'LA', name: 'Louisiana' },
        { code: 'ME', name: 'Maine' },
        { code: 'MD', name: 'Maryland' },
        { code: 'MA', name: 'Massachusetts' },
        { code: 'MI', name: 'Michigan' },
        { code: 'MN', name: 'Minnesota' },
        { code: 'MS', name: 'Mississippi' },
        { code: 'MO', name: 'Missouri' },
        { code: 'MT', name: 'Montana' },
        { code: 'NE', name: 'Nebraska' },
        { code: 'NV', name: 'Nevada' },
        { code: 'NH', name: 'New Hampshire' },
        { code: 'NJ', name: 'New Jersey' },
        { code: 'NM', name: 'New Mexico' },
        { code: 'NY', name: 'New York' },
        { code: 'NC', name: 'North Carolina' },
        { code: 'ND', name: 'North Dakota' },
        { code: 'OH', name: 'Ohio' },
        { code: 'OK', name: 'Oklahoma' },
        { code: 'OR', name: 'Oregon' },
        { code: 'PA', name: 'Pennsylvania' },
        { code: 'RI', name: 'Rhode Island' },
        { code: 'SC', name: 'South Carolina' },
        { code: 'SD', name: 'South Dakota' },
        { code: 'TN', name: 'Tennessee' },
        { code: 'TX', name: 'Texas' },
        { code: 'UT', name: 'Utah' },
        { code: 'VT', name: 'Vermont' },
        { code: 'VA', name: 'Virginia' },
        { code: 'WA', name: 'Washington' },
        { code: 'WV', name: 'West Virginia' },
        { code: 'WI', name: 'Wisconsin' },
        { code: 'WY', name: 'Wyoming' },
    ];

    //</editor-fold>

    closeableAlertVisible = true;

    loremIpsum = `
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Proin pellentesque urna in aliquet malesuada. Pellentesque sem neque,
        imperdiet id lorem ac, porttitor faucibus purus. Donec imperdiet
        lorem nec sem accumsan, vitae condimentum.
    `;

    constructor(private router: Router,
        private confirmationDialogService: ConfirmationDialogService) { }

    filterStates(val) {
        return val ? this.states.filter((s) => s.name.match(new RegExp(val, 'gi'))) : this.states;
    }

    handleAction(action: { name: string; selectedItems: Array<any> }): void {
        switch (action.name) {
            default:
                break;
        }
    }

    gotoStep($event: number) {
        // eslint-disable-next-line no-alert
        alert(`Go To Step: ${$event + 1}`);
    }

    inlineFileSelectChanged(filePickerEvent: FilePickerEvent) {
        this.fileNamesTextareaRef.nativeElement.value = `${filePickerEvent.value[0].name}`;
    }

    openConfirmationDialog() {
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

        this.confirmationDialogService.openDialog(myDialogConfig).subscribe(
            // eslint-disable-next-line no-console
            (result) => console.log('Dialog closed with: ', result)
        );
    }
}
