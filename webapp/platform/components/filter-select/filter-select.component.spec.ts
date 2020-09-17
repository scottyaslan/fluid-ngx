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

import { Component, ViewChild } from '@angular/core';
import { async } from '@angular/core/testing';
import { cfxConfigureTestingModule } from 'webapp/testing/configureTestingModule';

import { cfxCreateComponent, CfxComponentFixture } from 'webapp/testing/createComponent';
import { FilterSelectComponent } from './filter-select.component';
import { FilterSelectModule } from './filter-select.module';

@Component({
    selector: `host-component`,
    template: `<cfx-filter-select></cfx-filter-select>`
})
class TestHostComponent {
    @ViewChild(FilterSelectComponent, { static: true })
    public componentUnderTestComponent: FilterSelectComponent;
}

describe('FilterSelectComponent', () => {
    let component: FilterSelectComponent;
    let fixture: CfxComponentFixture<FilterSelectComponent>;

    // helpers
    const getTriggerButton = () => component.wrapperElementRef.nativeElement.querySelector('.cfx-filter-select-trigger') as HTMLButtonElement;
    const getOptionList = () => component.wrapperElementRef.nativeElement.querySelector('.cfx-filter-select-list') as HTMLDivElement;
    const getOption = (title: string) => {
        const option = component.wrapperElementRef.nativeElement.querySelector(`[data-qa=cfx-filter-select-list-item-${title.toLowerCase().replace(/ /g, '-')}]>label`);
        return option as HTMLInputElement;
    };
    const getSearchField = () => {
        const input = component.wrapperElementRef.nativeElement.querySelector('[data-qa=cfx-filter-select-list-search-field]');
        return input as HTMLInputElement;
    };

    beforeEach(async(() => {
        cfxConfigureTestingModule({
            declarations: [TestHostComponent],
            imports: [
                FilterSelectModule
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = cfxCreateComponent(FilterSelectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    describe('when options are passed', () => {
        beforeEach(() => {
            component.options = [{ title: 'A', value: 'a' }, { title: 'B', value: 'b' }];
            fixture.detectChanges();
        });

        it('button should display correct count', () => {
            const button = getTriggerButton();

            expect(button.innerHTML.includes('2')).toBe(true);
        });

        it('initially option list is not present', () => {
            const optionList = getOptionList();

            expect(optionList).toBeFalsy();
        });

        describe('and button is clicked, then', () => {
            beforeEach(() => {
                const button = getTriggerButton();
                button.click();
                fixture.detectChanges();
            });

            it('option list is present', () => {
                const optionList = getOptionList();

                expect(optionList).toBeDefined();
            });

            it('a following click outside of component closes the list', () => {
                document.body.click();
                fixture.detectChanges();
                const optionList = getOptionList();

                expect(optionList).toBeFalsy();
            });
        });

        describe('and list is open for selection, then clicking on the first item', () => {
            beforeEach(() => {
                spyOn(component.onSelection, 'emit');
                component.isListOpen = true;
                fixture.detectChanges();
                getOption('A').click();
                fixture.detectChanges();
            });

            it('should make selection', () => {
                expect(component.selectedItems.length).toBe(1);
            });

            it('should change button\'s text', () => {
                const button = getTriggerButton();

                expect(button.innerHTML.includes('1 of 2')).toBe(true);
            });

            it('again should clear selection', () => {
                getOption('A').click();
                fixture.detectChanges();

                expect(component.selectedItems.length).toBe(0);
            });

            it('onSelection should be emitted with expected value', () => {
                expect(component.onSelection.emit).toHaveBeenCalledWith(component.selectedItems);
            });
        });

        describe('and list is open for selection, then filtering the list', () => {
            beforeEach(() => {
                component.isListOpen = true;
                fixture.detectChanges();
                const searchField = getSearchField();
                searchField.value = 'a';
                searchField.dispatchEvent(new Event('input'));
                fixture.detectChanges();
            });

            it('should decrease number of options', () => {
                const options = component.wrapperElementRef.nativeElement.querySelectorAll('.cfx-filter-select-list-item');

                expect(options.length).toBe(1);
            });
        });
    });

    describe('when clearSelection has been called', () => {
        beforeEach(() => {
            spyOn(component.onSelection, 'emit');
            component.selectedItems = [{ title: 't1', value: 'v1' }, { title: 't2', value: 'v2' }];
            component.clearSelection();
            fixture.detectChanges();
        });

        it('then selectedItems should be empty array', () => {
            expect(component.selectedItems).toEqual([]);
        });

        it('then onSelection is emitted with empty array', () => {
            expect(component.onSelection.emit).toHaveBeenCalledWith([]);
        });
    });

    describe('when keyboard users interact with keydown events', () => {
        let itemsCheckbox: HTMLElement[];
        let itemsInput: HTMLElement[];
        let button: HTMLButtonElement;

        beforeEach(() => {
            component.options = [{ title: 'A', value: 'a' }, { title: 'B', value: 'b' }, { title: 'C', value: 'c' }];
            component.isListOpen = true;
            fixture.detectChanges();
            itemsCheckbox = fixture.queryAllByDataQaContains('cfx-filter-select-list-item-');
            itemsInput = fixture.queryAllByDataQaContains('cfx-filter-select-list-item-', 'input');
            button = getTriggerButton();
            itemsInput.map((item) => spyOn(item, 'focus').and.callThrough());
            spyOn(button, 'focus').and.callThrough();
        });

        it('should navigate the items list with Up and Down', () => {
            const downEvent = new KeyboardEvent('keydown', {
                key: 'ArrowDown'
            });
            const upEvent = new KeyboardEvent('keydown', {
                key: 'ArrowUp'
            });

            itemsCheckbox[0].focus();
            itemsCheckbox[0].dispatchEvent(downEvent);
            fixture.detectChanges();
            expect(itemsInput[1].focus).toHaveBeenCalled();

            itemsCheckbox[1].dispatchEvent(upEvent);
            fixture.detectChanges();
            expect(itemsInput[0].focus).toHaveBeenCalled();
        });

        it('should proceed to the last option in the list with End', () => {
            const endEvent = new KeyboardEvent('keydown', {
                key: 'End'
            });

            itemsCheckbox[0].focus();
            itemsCheckbox[0].dispatchEvent(endEvent);
            fixture.detectChanges();
            expect(itemsInput[2].focus).toHaveBeenCalled();
        });

        it('should proceed to the first option in the list with Home', () => {
            const homeEvent = new KeyboardEvent('keydown', {
                key: 'Home'
            });

            itemsCheckbox[2].focus();
            itemsCheckbox[2].dispatchEvent(homeEvent);
            fixture.detectChanges();
            expect(itemsInput[0].focus).toHaveBeenCalled();
        });

        it('should close the menu and return focus to the trigger button with Tab', () => {
            const tabEvent = new KeyboardEvent('keydown', {
                key: 'Tab'
            });

            itemsCheckbox[0].focus();
            itemsCheckbox[0].dispatchEvent(tabEvent);
            expect(component.isListOpen).toBe(false);
            expect(button.focus).toHaveBeenCalled();
        });

        it('should close the menu and return focus to the trigger button with Escape', () => {
            const escEvent = new KeyboardEvent('keydown', {
                key: 'Escape'
            });

            itemsCheckbox[0].focus();
            itemsCheckbox[0].dispatchEvent(escEvent);
            expect(component.isListOpen).toBe(false);
            expect(button.focus).toHaveBeenCalled();
        });
    });
});
