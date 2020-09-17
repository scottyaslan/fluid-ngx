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

import { Observable } from 'rxjs';
import { Store, createAction, props, ActionCreator, Action, on } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { ResourceManagerService } from '../../resource-manager.service';
import { ResourceMetadata, ResourceState, ResourceActions, ResourceQueries, ResourceSelectors, ResourceBase } from '../resource-base';

export interface CollectionState<T> {
    elements?: T[];
    links?: any;
    page?: any;
}

export interface CollectionActions<T> extends ResourceActions {
    updateSingle: ActionCreator<string, (props: { updateElement: T, identifier: string }) => Action>;
}

export interface CollectionQueries<T> extends ResourceQueries<CollectionState<T>> {

}
export interface CollectionSelectors<T> extends ResourceSelectors<CollectionState<T>> {
    entities: (state: ResourceState<T>) => T[];
    totalEntitiesCount: (state: ResourceState<T>) => number;
    entityById: (identifier: string, id: any) => (state: ResourceState<T>) => T;
}

export interface CollectionMetadata<T> extends ResourceMetadata<CollectionState<T>> {
    actions: CollectionActions<T>;
    queries: CollectionQueries<T>;
    selectors: CollectionSelectors<T>;
}

export interface EntitiesWithStatus<T> {
    entities$: Observable<T[]> | Store<T[]>;
    loading$: Observable<boolean> | Store<boolean>;
    loaded$: Observable<boolean> | Store<boolean>;
    error$: Observable<any>;
    initialized$?: Observable<boolean> | Store<boolean>;
}

/**
 * A utility that loads a given collection and makes it available from the store
 * See 'resource-base.ts' for more details
 *
 * Collection must have the following structure:
 *
 * {
 *    elements: [
 *        element1,
 *        element2,
 *        ...
 *    ]
 * }
 *
 * // load the full collection from the backend
 * myCollectionService.load();
 *
 * // access the array of the elements only
 * const entities$ = myCollectionService.entities$
 */
export abstract class CollectionResourceBase<T> extends ResourceBase<CollectionState<T>> {
    metadata: CollectionMetadata<T>;
    entities$: Observable<T[]>;
    totalEntitiesCount$: Observable<number>;

    entitiesWithStatus: EntitiesWithStatus<T>;

    constructor(
        resourceName: string,
        resourceService: ResourceManagerService,
        store: Store<any>,
    ) {
        super(
            resourceName,
            { elements: [], page: { totalElements: 0 } },
            resourceService,
            store
        );

        this.entities$ = this.store.select((this.metadata as CollectionMetadata<T>).selectors.entities);
        this.totalEntitiesCount$ = this.store.select((this.metadata as CollectionMetadata<T>).selectors.totalEntitiesCount);
        this.entitiesWithStatus = {
            entities$: this.entities$,
            loading$: this.loading$,
            loaded$: this.loaded$,
            error$: this.error$,
            initialized$: this.initialized$
        };
    }

    create(): CollectionMetadata<T> {
        const updateSingle = createAction(`[${this.resourceName}] resource/updateSingle`, props<{ updateElement: T, identifier: string }>());

        this.metadata = super.create() as CollectionMetadata<T>;
        this.metadata.selectors.entities = (state) => state[this.resourceName].resource.elements;
        this.metadata.selectors.totalEntitiesCount = (state) => (state[this.resourceName].resource.page ? state[this.resourceName].resource.page.totalElements : 0);
        this.metadata.selectors.entityById = (identifier, id) => (state) => state[this.resourceName].resource.elements.find((e) => e[identifier] === id);

        this.metadata.reducerOns.push(
            on(updateSingle, (state, { updateElement, identifier }) => ({
                ...state,
                resource: {
                    ...state.resource,
                    elements: state.resource.elements.map((e: T) => (e[identifier] === updateElement[identifier] ? updateElement : e))
                }
            }))
        );

        this.metadata.actions = { ...this.metadata.actions, updateSingle };

        return this.metadata;
    }

    updateSingle(data: T, identifier: string = 'id') {
        this.store.dispatch(this.metadata.actions.updateSingle({ updateElement: data, identifier }));
    }

    protected validateCollectionResponse = map((response: CollectionState<T>) => {
        if (response.elements) return response;
        throw new Error('Invalid data');
    });

    // Implement get() to connect the api, like this:
    //     get(): Observable<CollectionState<MyData>> {
    //         return this.httpClient.get<CollectionState<MyData>>(`/${environment.apiUrl}/my-collection`)
    //             .pipe(this.validateCollectionResponse);
    //     }
    abstract get(params?: any): Observable<CollectionState<T>>;
}
