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

import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { PageEvent } from '@angular/material';
import { LocalStorageService } from './local-storage.service';
import { PROTECTED_DATATABLE_NAMES } from '../../shared/constants/protected-datatable-names';

@Injectable()
export class DatatableService {
    constructor(private localStorageService: LocalStorageService) {}

    readonly localstorageItemName = 'currentDatatableSettings';
    readonly keys = {
        pageSize: 'pageSize',
        orderBy: 'orderBy',
        orderDirection: 'orderDirection',
        lastCheckedAt: 'lastCheckedAt'
    };

    readonly defaultProtectedKeys = [..._.map(PROTECTED_DATATABLE_NAMES), this.keys.lastCheckedAt];

    savePageSize(datatableName: string, pageEvent: PageEvent) {
        const { pageSize } = pageEvent;
        this.findAndUpdateEntry(datatableName, this.keys.pageSize, pageSize);
    }

    saveOrderBy(datatableName: string, orderBy: string) {
        this.findAndUpdateEntry(datatableName, this.keys.orderBy, orderBy);
    }

    saveOrderDirection(datatableName: string, orderDirection: string) {
        this.findAndUpdateEntry(datatableName, this.keys.orderDirection, orderDirection);
    }

    getPageSize(datatableName: string) {
        const entry = this.findEntry(datatableName);
        return _.get(entry, this.keys.pageSize, null);
    }

    getOrderBy(datatableName: string) {
        const entry = this.findEntry(datatableName);
        return _.get(entry, this.keys.orderBy, null);
    }

    getOrderDirection(datatableName: string) {
        const entry = this.findEntry(datatableName);
        return _.get(entry, this.keys.orderDirection, null);
    }

    removeEntry(datatableName: string) {
        const datatableSettings = this.getDatatableSettings();
        _.unset(datatableSettings, datatableName);
        this.localStorageService.setLocalStorageItem(this.localstorageItemName, datatableSettings);
    }

    findEntry(datatableName: string) {
        const datatableSettings = this.getDatatableSettings();
        return _.get(datatableSettings, datatableName, undefined);
    }

    findAndUpdateEntry(datatableName: string, key: string, newValue: any) {
        const datatableSettings = this.getDatatableSettings();
        const selectedEntry = _.get(datatableSettings, datatableName, null);
        if (!_.isNil(selectedEntry)) {
            _.set(selectedEntry, `${key}`, newValue);
        } else {
            const newEntry = {};
            _.set(newEntry, `${key}`, newValue);
            _.set(datatableSettings, `${datatableName}`, newEntry);
        }
        this.localStorageService.setLocalStorageItem(this.localstorageItemName, datatableSettings);
    }

    getDatatableSettings(): any {
        return this.localStorageService.getLocalStorageItemAsObject(this.localstorageItemName);
    }

    updateLastCheckDate(type: 'stack' | 'environment') {
        const datatableSettings = this.getDatatableSettings();
        _.set(datatableSettings, `${this.keys.lastCheckedAt}.${type}`, Date.now());
        this.localStorageService.setLocalStorageItem(this.localstorageItemName, datatableSettings);
    }

    getLastCheckDate(type: 'stack' | 'environment') {
        const datatableSettings = this.getDatatableSettings();
        return _.get(datatableSettings, `${this.keys.lastCheckedAt}.${type}`, null);
    }

    cleanup(type: 'stack' | 'environment', protectedKeys: string[]) {
        const datatableSettings = _.cloneDeep(this.getDatatableSettings());
        switch (type) {
            case 'stack':
                _.map(datatableSettings, (entry, key) => {
                    if (
                        !key.includes('environment-details-datatable')
                        && !this.defaultProtectedKeys.includes(key)
                        && !protectedKeys.includes(key)
                    ) {
                        _.unset(datatableSettings, key);
                    }
                });
                break;
            case 'environment':
                _.map(datatableSettings, (entry, key) => {
                    if (
                        !key.includes('stack-datatable')
                        && !this.defaultProtectedKeys.includes(key)
                        && !protectedKeys.includes(key)
                    ) {
                        _.unset(datatableSettings, key);
                    }
                });
                break;
            default:
                break;
        }
        this.localStorageService.setLocalStorageItem(this.localstorageItemName, datatableSettings);
    }

    findItemKeys(protectedType: 'stack-datatable' | 'environment-details-datatable', crns: string[]) {
        const keysOfProtectedItems: string[] = [];
        _.map(this.getDatatableSettings(), (entry, key) => {
            if (!key.includes('@') || key.includes(protectedType)) {
                return;
            }
            let exists = false;
            crns.forEach((crn) => {
                if (key.includes(crn)) {
                    exists = true;
                }
            });
            if (exists) {
                keysOfProtectedItems.push(key);
            }
        });
        return keysOfProtectedItems;
    }
}
