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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
    MatCardModule,
    MatTabsModule,
    MatInputModule,
    MatPaginatorModule,
    MatIconModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatTooltipModule,
} from '@angular/material';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { PlatformModule } from 'webapp/platform';
import { ConfirmationDialogModule } from 'webapp/platform/components/confirmation-dialog/confirmation-dialog.module';
import { TooltipModule } from 'webapp/platform/components/tooltip/tooltip.module';
import { InfoCardModule } from 'webapp/platform/components/info-card/info-card.module';
import { FluidNgMatXComponent } from './fluid-ng-mat-x.component';
import { SidenavDemoContentComponent } from './common/sidenav-demo-content/sidenav-demo-content.component';

@NgModule({
    declarations: [
        FluidNgMatXComponent,
        SidenavDemoContentComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        FlexLayoutModule,
        PlatformModule,
        MatCardModule,
        MatIconModule,
        MatTabsModule,
        MatMenuModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatSelectModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatInputModule,
        MatRadioModule,
        MatProgressBarModule,
        MatExpansionModule,
        MatPaginatorModule,
        MatTooltipModule,
        NgxSkeletonLoaderModule,
        ConfirmationDialogModule,
        TooltipModule,
        InfoCardModule
    ]
})
export class FluidNgMatXModule { }
