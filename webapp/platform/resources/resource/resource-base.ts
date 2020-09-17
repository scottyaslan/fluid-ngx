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
import { Store, createAction, props, Action, on, ActionCreator, On } from '@ngrx/store';
import { debounceTime, filter, take } from 'rxjs/operators';
import { ResourceMetadataBase, ResourceManagerService } from '../resource-manager.service';
import { LoadAction } from './resource-effects.service';

export interface ResourceState<T, E = any> {
    resource: T; // the response from the backend
    loading: boolean;
    loaded: boolean;
    error: any;
    extra?: E; // any additional ui state
    initialized?: boolean;
}

export interface ResourceError {
    status: number;
    message: string;
}

export interface ResourceActions {
    clear: ActionCreator<string, () => Action>;
    load: ActionCreator<string, (params: any) => Action>;
    loadSuccess: ActionCreator<string, (params: any) => Action>;
    loadError: ActionCreator<string, (error: ResourceError) => Action>;
}

export interface ResourceQueries<T> {
    get: (params: any) => Observable<T>;
}
export interface ResourceSelectors<T, E = any> {
    resource: (state: ResourceState<T, E>) => T;
    error: (state: ResourceState<T, E>) => ResourceError;
    loading: (state: ResourceState<T, E>) => boolean;
    loaded: (state: ResourceState<T, E>) => boolean;
    extra: (state: ResourceState<T, E>) => E;
    initialized: (state: ResourceState<T, E>) => boolean;
}

export interface ResourceMetadata<T, E = any> extends ResourceMetadataBase<ResourceState<T, E>> {
    actions: ResourceActions;
    queries: ResourceQueries<T>;
    selectors: ResourceSelectors<T, E>;
}

/**
 * A utility that loads a given resource and makes it available from the store
 * Example of usage:
 *
 * @Injectable({ providedIn: 'root' })
 * export class MyDataService extends ResourceBase<MyData> {
 *     constructor(
 *         resourceService: ResourceManagerService,
 *         store: Store<any>,
 *         private httpClient: HttpClient
 *     ) {
 *         super('MyData', {}, resourceService, store);
 *     }
 *
 *     get(): Observable<MyData> {
 *         return this.httpClient.get<MyData>(`${environment.apiUrl}/my-data`)
 *     );
 * }
 *
 * // load from the backend
 * myDataService.load();
 *
 * // use it
 * const data$ = myDataService.resource$
 */
export abstract class ResourceBase<T, E = any> {
    metadata: ResourceMetadata<T, E>;

    // observables to access the store
    resource$: Observable<T>; // the response from the backend api, null if nothing loaded
    error$: Observable<ResourceError>; // the current error message, null if no error
    loading$: Observable<boolean>; // loading is progress, including subsequent polling requests
    loaded$: Observable<boolean>; // something is already loaded and available
    extra$: Observable<E>; // something is already loaded and available
    initialized$: Observable<boolean>; // received response from the API for first time after page reload

    // stream of error events only (no default state)
    errorEvents$: Observable<ResourceError>;

    constructor(
        protected resourceName: string,
        protected initialValue: T,
        protected resourceManagerService: ResourceManagerService,
        protected store: Store<any>,
        protected initialExtra: E = null,
    ) {
        // creating actions and reducer
        this.metadata = this.create();

        // registering the resource
        this.resourceManagerService.register(this.metadata);

        // selectors
        this.resource$ = this.store.select(this.metadata.selectors.resource);
        this.error$ = this.store.select(this.metadata.selectors.error);
        this.loading$ = this.store.select(this.metadata.selectors.loading);
        this.loaded$ = this.store.select(this.metadata.selectors.loaded);
        this.extra$ = this.store.select(this.metadata.selectors.extra);
        this.initialized$ = this.store.select(this.metadata.selectors.initialized);

        // error events
        this.errorEvents$ = this.error$.pipe(
            filter((error) => !!(error)),
            debounceTime(0) // collect errors and wait for current routing to finish
        );
    }

    create(): ResourceMetadata<T, E> {
        const { resourceName, initialValue, initialExtra } = this;

        // initial state
        const initialState: ResourceState<T, E> = {
            resource: initialValue,
            loading: false,
            loaded: false,
            error: null,
            extra: initialExtra,
            initialized: false
        };

        // actions
        const clear = createAction(`[${resourceName}] resource/clear`);
        const load = createAction(`[${resourceName}] resource/load`, props<{ params: any }>());
        const loadSuccess = createAction(`[${resourceName}] resource/load/success`, props<{ data: T, loadAction: LoadAction }>());
        const loadError = createAction(`[${resourceName}] resource/load/error`, props<ResourceError>());

        // reducer
        const reducerOns: On<ResourceState<T, E>>[] = [
            on(clear, (state) => ({
                ...state,
                resource: initialValue,
                loaded: null,
                loading: false,
                error: null,
            })),
            on(load, (state) => ({
                ...state,
                loading: true
            })),
            on(loadSuccess, (state, { data }) => ({
                ...state,
                resource: data,
                loaded: true,
                loading: false,
                error: null,
                initialized: true
            })),
            on(loadError, (state, error) => ({
                ...state,
                resource: initialValue,
                loaded: false,
                loading: false,
                error,
                initialized: true
            }))
        ];

        const metadata: ResourceMetadata<T> = {
            resourceName,
            actions: {
                clear,
                load,
                loadSuccess,
                loadError
            },
            initialState,
            reducerOns,
            queries: {
                get: this.get.bind(this)
            },
            selectors: {
                resource: (state) => state[resourceName].resource,
                error: (state) => state[resourceName].error,
                loading: (state) => state[resourceName].loading,
                loaded: (state) => state[resourceName].loaded,
                extra: (state) => state[resourceName].extra,
                initialized: (state) => state[resourceName].initialized
            }
        };
        return metadata;
    }

    // Implement get() to connect the api, like this:
    //     get(): Observable<MyData> {
    //         return this.httpClient.get<MyData>(`/${environment.apiUrl}/my-data`)
    //     }
    abstract get(params?: any): Observable<T>;

    // starts loading the given resource
    load(params?: any) {
        this.store.dispatch(this.metadata.actions.load({ params }));
    }

    // clears the given resource
    clear() {
        this.store.dispatch(this.metadata.actions.clear());
    }

    // gets the current value of the resource
    // DO NOt OVERUSE THIS, prefer to subscribe for resource$ in the component
    getSnapshot(): T {
        let snapshot: T;
        this.resource$.pipe(take(1)).subscribe((r) => { snapshot = r; });
        return snapshot;
    }

    // gets the current value of the extra ui state
    // DO NOt OVERUSE THIS, prefer to subscribe for extra$ in the component
    getExtraSnapshot(): E {
        let snapshot: E;
        this.extra$.pipe(take(1)).subscribe((e) => { snapshot = e; });
        return snapshot;
    }
}
