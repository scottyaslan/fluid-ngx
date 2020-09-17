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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { cfxConfigureTestingModule } from 'webapp/testing/configureTestingModule';

import { FilePickerComponent } from './file-picker.component';
import { FilePickerModule } from './file-picker.module';

const testFile1: File = new File([], 'test file1');
const testFile2: File = new File([], 'test file2');

describe('FilePickerComponent', () => {
    let component: FilePickerComponent;
    let fixture: ComponentFixture<FilePickerComponent>;

    beforeEach(async(() => {
        cfxConfigureTestingModule({
            imports: [FilePickerModule]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FilePickerComponent);
        component = fixture.componentInstance;
    });

    describe('single file uploads are allowed', () => {
        it('should create a single file upload file picker component', () => {
            fixture.detectChanges();
            expect(component).toBeTruthy();
            expect(component.multiple).toBeFalsy();
        });

        it('should simulate an uploaded file, not allow user to open file browser to upload more files, test to get the file, and clear the file', () => {
            spyOn(component.fileInputRef.nativeElement, 'click');
            component.selectedFiles = [testFile1];
            fixture.detectChanges();
            component.openFileBrowser();
            expect(component.fileInputRef.nativeElement.click).not.toHaveBeenCalled();
            const files: File[] = component.getFiles();
            expect(files).toEqual(component.selectedFiles);
            const mockEvent = {
                preventDefault: () => {},
                stopPropagation: () => {}
            } as Event;
            component.clearFile(mockEvent, 0);
            const file: File[] = component.getFiles();
            expect(file.length).toEqual(0);
            component.openFileBrowser();
            expect(component.fileInputRef.nativeElement.click).toHaveBeenCalled();
        });

        it('fileDragHandler should update the hover validity', () => {
            fixture.detectChanges();
            component.fileDragHandler({
                preventDefault: () => {},
                stopPropagation: () => {},
                dataTransfer: { items: [testFile1] }
            } as unknown as DragEvent);
            fixture.detectChanges();
            expect(component.hoverValidity).toEqual('valid');
        });

        it('fileDropHandler should update the hover validity', () => {
            component.hoverValidity = 'test';
            fixture.detectChanges();
            component.fileDropHandler({
                preventDefault: () => {},
                stopPropagation: () => {},
                dataTransfer: { files: [testFile1] }
            } as unknown as DragEvent);
            fixture.detectChanges();
            expect(component.hoverValidity).toEqual('');
        });

        it('should reset the hover validity', () => {
            component.hoverValidity = 'test';
            fixture.detectChanges();
            component.fileDragEndHandler();
            fixture.detectChanges();
            expect(component.hoverValidity).toEqual('');
        });
    });

    describe('multiple file uploads are allowed', () => {
        beforeEach(() => {
            component.type = 'FILES';
        });

        it('should create a multiple file upload file picker component', () => {
            fixture.detectChanges();
            expect(component.multiple).toBeTruthy();
        });

        it('when a file is dropped, then output emit should be called', () => {
            fixture.detectChanges();
            spyOn(component.onFileChanged, 'emit');
            component.fileInputRef.nativeElement.dispatchEvent(new DragEvent('change'));
            fixture.detectChanges();
            expect(component.onFileChanged.emit).toHaveBeenCalled();
        });

        it('should simulate multiple uploaded files, allow user to open file browser to upload more files, test to get the files, and clear a file', () => {
            spyOn(component.fileInputRef.nativeElement, 'click');
            component.selectedFiles = [testFile1, testFile2];
            fixture.detectChanges();
            component.openFileBrowser();
            expect(component.fileInputRef.nativeElement.click).toHaveBeenCalled();
            const files: File[] = component.getFiles();
            expect(files).toEqual(component.selectedFiles);
            const mockEvent = {
                preventDefault: () => {},
                stopPropagation: () => {}
            } as Event;
            component.clearFile(mockEvent, 0);
            const file: File[] = component.getFiles();
            expect(file[0]).toEqual(testFile2);
        });

        it('fileDragHandler should update the hover validity', () => {
            fixture.detectChanges();
            component.fileDragHandler({
                preventDefault: () => {},
                stopPropagation: () => {},
                dataTransfer: { items: [testFile1] }
            } as unknown as DragEvent);
            fixture.detectChanges();
            expect(component.hoverValidity).toEqual('valid');
        });

        it('fileDropHandler should update the hover validity', () => {
            component.hoverValidity = 'test';
            fixture.detectChanges();
            component.fileDropHandler({
                preventDefault: () => {},
                stopPropagation: () => {},
                dataTransfer: { files: [testFile1] }
            } as unknown as DragEvent);
            fixture.detectChanges();
            expect(component.hoverValidity).toEqual('');
        });

        it('should reset the hover validity', () => {
            component.hoverValidity = 'test';
            fixture.detectChanges();
            component.fileDragEndHandler();
            fixture.detectChanges();
            expect(component.hoverValidity).toEqual('');
        });
    });

    it('should call event.preventDefault() to avoid scrolling with space when keyboard event is handled for file picker', () => {
        const event = new KeyboardEvent('keydown');
        spyOn(event, 'preventDefault');
        component.openFileBrowser(event);

        expect(event.preventDefault).toHaveBeenCalled();
    });
});
