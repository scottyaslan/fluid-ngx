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

import { Component, OnInit, Input, ViewEncapsulation, ViewChild, ElementRef, HostListener, Output, EventEmitter, AfterViewChecked, ViewChildren, QueryList } from '@angular/core';
import { MatCheckboxChange, MatCheckbox } from '@angular/material/checkbox';
import { hasModifierKey } from '@angular/cdk/keycodes';
import * as _ from 'lodash';
import { MatButton } from '@angular/material';

export interface FilterSelectOption {
    title: string;
    value: any;
    icon?: string;
}

@Component({
    selector: 'cfx-filter-select',
    templateUrl: './filter-select.component.html',
    styleUrls: ['./filter-select.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {
        role: 'listbox'
    },
})
export class FilterSelectComponent implements OnInit, AfterViewChecked {
    @Input() options: FilterSelectOption[] = [];
    @Input() selectedItems: FilterSelectOption[] = [];
    @Input() filterTitle: string;
    @Input() searchable: boolean = true;
    @Input() multiple: boolean = true;
    @Input() flat: boolean = false;
    @Input() width: string = 'auto';
    @Output() onSelection = new EventEmitter<FilterSelectOption[]>();

    @ViewChild('wrapperElement', { static: true }) wrapperElementRef: ElementRef<HTMLDivElement>;
    @ViewChild('searchField', { static: false }) searchField: ElementRef<HTMLInputElement>;
    @ViewChild('trigger', { static: false }) trigger: MatButton;
    @ViewChildren('listOption') listOptionRef: QueryList<MatCheckbox|ElementRef>;

    isListOpen = false;
    search = '';
    private needFocus = false;

    constructor() { }

    ngOnInit() { }

    ngAfterViewChecked() {
        if (this.searchable && this.isListOpen && this.searchField && this.needFocus) {
            this.searchField.nativeElement.focus();
            this.needFocus = false;
        }
    }

    selectItem(changeEvent: MatCheckboxChange, item: FilterSelectOption) {
        if (changeEvent.checked) {
            this.selectedItems.push(item);
        } else {
            this.selectedItems = _.without(this.selectedItems, item);
        }
        this.onSelection.emit(this.selectedItems);
    }

    selectSingleItem(item: FilterSelectOption) {
        this.selectedItems = [item];
        this.onSelection.emit(this.selectedItems);
        this.toggleList();
    }

    toggleList() {
        this.isListOpen = !this.isListOpen;
        this.needFocus = this.isListOpen;
    }

    clearSearch(event: Event) {
        event.stopPropagation(); // avoid outsideClick()
        this.search = '';
    }

    clearSelection() {
        this.selectedItems = [];
        this.onSelection.emit(this.selectedItems);
    }

    @HostListener('document:click', ['$event'])
    outsideClick(event: MouseEvent) {
        const clickTarget = event.target as HTMLElement;
        const outsideClick = !this.wrapperElementRef.nativeElement.contains(clickTarget);

        if (outsideClick && this.isListOpen) {
            this.toggleList();
        }
    }

    handleKeydown(event: KeyboardEvent, multi = true, option?: FilterSelectOption) {
        const { key } = event;
        const listOptions: (MatCheckbox|HTMLElement)[] = this.listOptionRef.toArray().map((optionRef) => {
            if ('id' in optionRef) {
                return optionRef;
            }
            return optionRef.nativeElement;
        });
        const currentOptionIndex = listOptions.findIndex((o) => o.id === (event.currentTarget as HTMLInputElement).id);

        switch (key) {
            case 'Home':
                event.preventDefault();
                listOptions[0].focus();
                break;
            case 'End':
                event.preventDefault();
                listOptions[listOptions.length - 1].focus();
                break;
            case 'Down': // IE/Edge specific value
            case 'ArrowDown':
                event.preventDefault();
                if (currentOptionIndex !== listOptions.length - 1) {
                    listOptions[currentOptionIndex + 1].focus();
                }
                break;
            case 'Up': // IE/Edge specific value
            case 'ArrowUp':
                event.preventDefault();
                if (currentOptionIndex !== 0) {
                    listOptions[currentOptionIndex - 1].focus();
                }
                break;
            case 'Esc': // IE/Edge specific value
            case 'Escape':
            case 'Tab':
                if (!hasModifierKey(event)) {
                    event.preventDefault();
                    this.toggleList();
                    this.trigger.focus();
                }
                break;
            case ' ':
                if (!multi) {
                    event.preventDefault();
                    this.selectSingleItem(option);
                }
                break;
            default:
        }
    }

    optionByValue(index, option) {
        return option.value;
    }
}
