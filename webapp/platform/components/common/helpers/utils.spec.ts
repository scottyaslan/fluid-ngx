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

import { Utils } from './utils';

describe('Utils', () => {
    describe('safeJsonParse', () => {
        it('should return ', () => {
            const obj = Utils.safeJsonParse('{ "name":"John", "age":30, "city":"New York"}');
            expect(obj.name).toEqual('John');
        });

        it('should return string', () => {
            expect(Utils.safeJsonParse('{ "John", "age":30, "city":"New York"}')).toEqual('{ "John", "age":30, "city":"New York"}');
        });
    });

    describe('getDateStringFromLong', () => {
        it('should return null if null is passed as the argument', () => {
            expect(Utils.getDateStringFromLong(null)).toBeNull();
        });

        it('should return date formatted string for a timestamp', () => {
            const timestamp = 1578598904245;
            expect(Utils.getDateStringFromLong(timestamp, 'en-US', { timeZone: 'America/New_York', timeZoneName: 'short' })).toBe('1/9/2020, 2:41:44 PM EST');
        });

        it('should return date formatted string for a timestamp from other time zones', () => {
            const timestamp = 1578598904245;
            expect(Utils.getDateStringFromLong(timestamp, 'hu-HU', { timeZone: 'Europe/Budapest', timeZoneName: 'short' })).toBe('2020. 01. 09. 20:41:44 CET');
        });
    });
});
