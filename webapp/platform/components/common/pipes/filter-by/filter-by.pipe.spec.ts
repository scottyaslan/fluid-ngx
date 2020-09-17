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

import { FilterByPipe } from './filter-by.pipe';

describe('FilterByPipe', () => {
    let pipe: FilterByPipe;
    const list = [
        { name: 'AA', value: 'aa', severity: 'warning', count: 0 },
        { name: 'BA', value: 'ba', severity: 'ERROR', count: 10 },
        { name: 'CD', value: 'cd', severity: 'Info', count: -1 },
    ];

    beforeEach(() => {
        pipe = new FilterByPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    describe('with boolean', () => {
        describe('filters list by "count"', () => {
            it('greater than 0', () => {
                const isGreaterThanZero = (listItem) => listItem > 0;
                const actual = pipe.transform(list, 'count', true, isGreaterThanZero);

                expect(actual.length).toBe(1);
            });
        });
    });

    describe('with simple string', () => {
        describe('filters list by "name"', () => {
            const expected = list.filter((item) => item.name.toLowerCase().includes('a'));

            it('with lower case input', () => {
                const actual = pipe.transform(list, 'name', 'a');

                expect(actual).toEqual(expected);
            });

            it('with upper case input', () => {
                const actual = pipe.transform(list, 'name', 'A');

                expect(actual).toEqual(expected);
            });
        });

        it('filters list by "value"', () => {
            const actual = pipe.transform(list, 'value', 'd');

            expect(actual.length).toBe(1);
        });
    });

    describe('with string array', () => {
        describe('filters list by "severity"', () => {
            it('with lower case input', () => {
                const expected = [list[1], list[2]];
                const actual = pipe.transform(list, 'severity', ['info', 'error']);

                expect(actual).toEqual(expected);
            });

            it('with upper case input', () => {
                const expected = [list[0], list[2]];
                const actual = pipe.transform(list, 'severity', ['WARNING', 'INFO']);

                expect(actual).toEqual(expected);
            });
        });
    });
});
