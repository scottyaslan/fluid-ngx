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

import { fakeAsync, tick } from '@angular/core/testing';
import { cfxConfigureTestingModule } from 'webapp/testing/configureTestingModule';
import { cfxCreateComponent, CfxComponentFixture } from 'webapp/testing/createComponent';
import { FilterInputComponent } from './filter-input.component';
import { FilterInputModule } from './filter-input.module';

describe('FilterInputComponent', () => {
    let component: FilterInputComponent;
    let fixture: CfxComponentFixture<FilterInputComponent>;
    let filterChangeOutput;

    const getInput = () => fixture.queryByDataQa('filter-input') as HTMLInputElement;

    beforeEach(fakeAsync(() => {
        cfxConfigureTestingModule({
            imports: [FilterInputModule]
        })
            .compileComponents();
    }));

    beforeEach(fakeAsync(() => {
        fixture = cfxCreateComponent(FilterInputComponent);
        component = fixture.componentInstance;
        filterChangeOutput = spyOn(component.filterChange, 'emit');
    }));

    it('should create', fakeAsync(() => {
        expect(component).toBeTruthy();

        fixture.detectChanges();
        tick();
        expect(getInput().value).toEqual('');

        expect(filterChangeOutput).not.toHaveBeenCalled();
    }));

    it('should show initial filter', fakeAsync(() => {
        component.filter = 'My filter';
        fixture.detectChanges();
        tick();

        expect(getInput().value).toEqual('My filter');
        expect(filterChangeOutput).not.toHaveBeenCalled();
    }));

    it('should follow input value changes', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        expect(getInput().value).toEqual('');

        component.filter = 'My filter';
        fixture.detectChanges();
        tick();
        expect(getInput().value).toEqual('My filter');

        component.filter = '';
        fixture.detectChanges();
        tick();
        expect(getInput().value).toEqual('');

        expect(filterChangeOutput).not.toHaveBeenCalled();
    }));

    it('should report changes', fakeAsync(() => {
        fixture.detectChanges();
        tick();

        fixture.writeValueIntoInput(getInput(), 'My filter');
        expect(filterChangeOutput).toHaveBeenCalledWith('My filter');
        expect(getInput().value).toEqual('My filter');
    }));

    it('should clear filter by X button', fakeAsync(() => {
        component.filter = 'My filter';
        fixture.detectChanges();
        tick();
        expect(getInput().value).toEqual('My filter');

        fixture.queryByDataQa('filter-input-clear-button').click();
        fixture.detectChanges();
        tick();

        expect(getInput().value).toEqual('');
        expect(filterChangeOutput).toHaveBeenCalledWith('');
    }));
});
