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

import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';

export interface FilePickerEvent {
    group: string,
    control: string,
    value: File[]
}

@Component({
    selector: 'cfx-file-picker',
    templateUrl: './file-picker.component.html',
    styleUrls: ['./file-picker.component.scss']
})
export class FilePickerComponent implements OnInit {
    @Input() type: 'TEXT' | 'FILE' | 'FILES' | 'DIRECTORY' = 'TEXT';
    @Input() selectedFiles: File[] = [];
    @Input() group: string = '';
    @Input() control: string = '';
    @Input() extensions: string = '';
    @Input() displayUploadedFiles: boolean = true;
    @Output() onFileChanged = new EventEmitter<FilePickerEvent>();

    @ViewChild('fileInput', { static: true }) fileInputRef: ElementRef;

    text: string;
    hoverValidity = '';
    multiple: boolean = false;

    constructor() { }

    ngOnInit() {
        if (this.type === 'FILES' || this.type === 'DIRECTORY') {
            this.multiple = true;
        }
    }

    clearFile(event: Event, index: number): File[] {
        event.preventDefault();
        event.stopPropagation();

        // Remove file by index
        this.selectedFiles.splice(index, 1);

        if (this.selectedFiles.length === 0) {
            this.fileInputRef.nativeElement.value = null;
        }
        this.onFileChanged.emit({ group: this.group, control: this.control, value: this.selectedFiles });

        return this.selectedFiles;
    }

    getFiles(): File[] {
        return this.selectedFiles;
    }

    openFileBrowser(event?: KeyboardEvent) {
        if (event) {
            event.preventDefault();
        }

        if (!this.multiple && this.selectedFiles.length === 0) {
            this.fileInputRef.nativeElement.click();
        } else if (this.multiple) {
            this.fileInputRef.nativeElement.click();
        }
    }

    fileChangeHandler(event: Event) {
        const { files } = event.target as HTMLInputElement;
        this.handleFile(Array.from(files));
    }

    fileDragHandler(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        const { items } = event.dataTransfer;
        this.hoverValidity = this.isFileInvalid(items)
            ? 'invalid'
            : 'valid';
    }

    fileDragEndHandler() {
        this.hoverValidity = '';
    }

    fileDropHandler(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        const { files } = event.dataTransfer;
        if (!this.isFileInvalid(Array.from(files))) {
            this.handleFile(Array.from(files));
        }
        this.hoverValidity = '';
    }

    private handleFile(files: File[]) {
        if (this.multiple === false) {
            if (this.selectedFiles.length === 0) {
                if (files.length === 1) {
                    this.selectedFiles = files;
                    this.onFileChanged.emit({ group: this.group, control: this.control, value: this.selectedFiles });
                }
            }
        } else {
            if (files.length > 0) {
                this.selectedFiles = this.selectedFiles.concat(files);
            }

            this.onFileChanged.emit({ group: this.group, control: this.control, value: this.selectedFiles });
        }
    }

    private isFileInvalid(items: DataTransferItemList | File[]) {
        return (!this.multiple && items.length > 1) || (this.extensions !== '' && (items[0].type === '' || this.extensions.indexOf(items[0].type) === -1));
    }
}
