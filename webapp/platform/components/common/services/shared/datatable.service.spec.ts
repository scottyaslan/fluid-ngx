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

import { createService } from '@ngneat/spectator';
import { DatatableService } from './datatable.service';
import { LocalStorageService } from './local-storage.service';

class LocalStorageServiceStub {
    getLocalStorageItemAsObject() {
        return {
            name: { pageSize: 10, orderBy: 'date', orderDirection: 'asc' },
            name2: { pageSize: 25, orderBy: 'created', orderDirection: 'desc' }
        };
    }

    setLocalStorageItem(): void {}
}

describe('DatatableService', () => {
    const spectator = createService<DatatableService>({
        service: DatatableService,
        imports: [],
        providers: [{ provide: LocalStorageService, useClass: LocalStorageServiceStub }]
    });
    let service: DatatableService;
    let localStorageService: LocalStorageService;
    let getLocalStorageItemAsObjectSpy: jasmine.Spy;
    let setLocalStorageItemSpy: jasmine.Spy;

    const datatableSettings = {
        'environment-details-datatable@crn0@': { orderBy: 'date', orderDirection: 'asc', pageSize: 10 },
        'environment-details-datatable@crn1@': { orderBy: 'name', orderDirection: 'asc', pageSize: 10 },
        'stack-datatable@crn2': { orderBy: 'created', orderDirection: 'desc', pageSize: 25 },
        'stack-datatable@crn3': { orderBy: 'status', orderDirection: 'desc', pageSize: 25 },
        'stack-datatable@crn4': { orderBy: 'version', orderDirection: 'desc', pageSize: 25 },
        lastCheckedAt: 1574254440034,
        sdxListDatatable: { orderBy: 'cloudPlatform' },
        randomEntryName: { orderBy: 'cloudPlatform' }
    };

    beforeEach(() => {
        service = spectator.service;

        localStorageService = spectator.get(LocalStorageService);
        getLocalStorageItemAsObjectSpy = spyOn(localStorageService, 'getLocalStorageItemAsObject').and.callThrough();
        setLocalStorageItemSpy = spyOn(localStorageService, 'setLocalStorageItem').and.callThrough();
    });

    it('should create the service', () => {
        expect(service).toBeTruthy();
    });

    describe('findEntry', () => {
        it('should return with the entry', () => {
            expect(service.findEntry('name2')).toEqual({
                pageSize: 25,
                orderBy: 'created',
                orderDirection: 'desc'
            });
        });

        it('should return undefined if the entry does not exist on the localstorage', () => {
            expect(service.findEntry('name3')).toBeUndefined();
        });
    });

    describe('getPageSize', () => {
        it('should return the pagesize', () => {
            expect(service.getPageSize('name2')).toEqual(25);
        });

        it('should return null if the entry does not exist on the localstorage', () => {
            expect(service.getPageSize('name3')).toBeNull();
        });
    });

    describe('getOrderBy', () => {
        it('should return the orderBy', () => {
            expect(service.getOrderBy('name2')).toEqual('created');
        });

        it('should return null if the entry does not exist on the localstorage', () => {
            expect(service.getOrderBy('name3')).toBeNull();
        });
    });

    describe('getOrderDirection', () => {
        it('should return the order direction', () => {
            expect(service.getOrderDirection('name2')).toEqual('desc');
        });

        it('should return null if the entry does not exist on the localstorage', () => {
            expect(service.getOrderDirection('name3')).toBeNull();
        });
    });

    describe('removeEntry', () => {
        it('should call the localstorage service with the proper parameters', () => {
            service.removeEntry('name2');
            expect(getLocalStorageItemAsObjectSpy).toHaveBeenCalled();
            expect(setLocalStorageItemSpy).toHaveBeenCalledWith('currentDatatableSettings', {
                name: { orderBy: 'date', orderDirection: 'asc', pageSize: 10 }
            });
        });
    });

    describe('findAndUpdateEntry', () => {
        it('should call the localstorage service with the proper parameters', () => {
            service.findAndUpdateEntry('name2', 'orderBy', 'status');
            expect(getLocalStorageItemAsObjectSpy).toHaveBeenCalled();
            expect(setLocalStorageItemSpy).toHaveBeenCalledWith('currentDatatableSettings', {
                name: { orderBy: 'date', orderDirection: 'asc', pageSize: 10 },
                name2: { orderBy: 'status', orderDirection: 'desc', pageSize: 25 }
            });
        });

        it('should call the localstorage service with the proper parameters', () => {
            service.findAndUpdateEntry('name3', 'orderBy', 'status');
            expect(getLocalStorageItemAsObjectSpy).toHaveBeenCalled();
            expect(setLocalStorageItemSpy).toHaveBeenCalledWith('currentDatatableSettings', {
                name: { orderBy: 'date', orderDirection: 'asc', pageSize: 10 },
                name2: { orderBy: 'created', orderDirection: 'desc', pageSize: 25 },
                name3: { orderBy: 'status' }
            });
        });
    });

    describe('cleanup', () => {
        it('should remove every not protected stack entry', () => {
            spyOn(service, 'getDatatableSettings').and.returnValue(datatableSettings);
            service.cleanup('stack', ['stack-datatable@crn2', 'stack-datatable@crn3']);
            expect(setLocalStorageItemSpy).toHaveBeenCalledWith('currentDatatableSettings', {
                'environment-details-datatable@crn1@': { orderBy: 'name', orderDirection: 'asc', pageSize: 10 },
                'environment-details-datatable@crn0@': { orderBy: 'date', orderDirection: 'asc', pageSize: 10 },
                lastCheckedAt: 1574254440034,
                sdxListDatatable: { orderBy: 'cloudPlatform' },
                'stack-datatable@crn2': { orderBy: 'created', orderDirection: 'desc', pageSize: 25 },
                'stack-datatable@crn3': { orderBy: 'status', orderDirection: 'desc', pageSize: 25 }
            });
        });

        it('should remove every not protected environment entry', () => {
            spyOn(service, 'getDatatableSettings').and.returnValue(datatableSettings);
            service.cleanup('environment', ['environment-details-datatable@crn0@']);
            expect(setLocalStorageItemSpy).toHaveBeenCalledWith('currentDatatableSettings', {
                'environment-details-datatable@crn0@': { orderBy: 'date', orderDirection: 'asc', pageSize: 10 },
                lastCheckedAt: 1574254440034,
                sdxListDatatable: { orderBy: 'cloudPlatform' },
                'stack-datatable@crn2': { orderBy: 'created', orderDirection: 'desc', pageSize: 25 },
                'stack-datatable@crn3': { orderBy: 'status', orderDirection: 'desc', pageSize: 25 },
                'stack-datatable@crn4': { orderBy: 'version', orderDirection: 'desc', pageSize: 25 }
            });
        });
    });

    describe('findItemKeys', () => {
        it('should return the keys that contains the crns and belongs to the stack datatable', () => {
            const localstorageValue = {
                'environment-details-datatable@same-crn1@': { orderBy: 'name', orderDirection: 'asc', pageSize: 10 },
                'stack-datatable@same-crn1': { orderBy: 'status', orderDirection: 'desc', pageSize: 25 }
            };
            spyOn(service, 'getDatatableSettings').and.returnValue(localstorageValue);
            expect(service.findItemKeys('environment-details-datatable', ['same-crn1'])).toEqual([
                'stack-datatable@same-crn1'
            ]);
        });

        it('should return the keys that contains the crns and belongs to the environment datatable', () => {
            const localstorageValue = {
                'environment-details-datatable@same-crn1@': { orderBy: 'name', orderDirection: 'asc', pageSize: 10 },
                'stack-datatable@same-crn1': { orderBy: 'status', orderDirection: 'desc', pageSize: 25 }
            };
            spyOn(service, 'getDatatableSettings').and.returnValue(localstorageValue);
            expect(service.findItemKeys('stack-datatable', ['same-crn1'])).toEqual([
                'environment-details-datatable@same-crn1@'
            ]);
        });

        it('should return empty array if the crn is found but it is not between two @', () => {
            const localstorageValue = {
                'environment-details-datatable-same-crn1': { orderBy: 'name', orderDirection: 'asc', pageSize: 10 },
                'stack-datatable-same-crn1': { orderBy: 'status', orderDirection: 'desc', pageSize: 25 }
            };
            spyOn(service, 'getDatatableSettings').and.returnValue(localstorageValue);
            expect(service.findItemKeys('stack-datatable', ['same-crn1'])).toEqual([]);
        });
    });
});
