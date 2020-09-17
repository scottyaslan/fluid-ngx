import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { ConfirmationDialogService } from './confirmation-dialog.service';
import { DialogModule } from '../dialog/dialog.module';

@NgModule({
    declarations: [ConfirmationDialogComponent],
    entryComponents: [ConfirmationDialogComponent],
    imports: [
        CommonModule,
        MatIconModule,
        DialogModule
    ],
    providers: [
        ConfirmationDialogService
    ]
})
export class ConfirmationDialogModule { }
