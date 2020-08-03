import { IContextKeyServiceTarget, IContextKey, ContextKeyExpr } from '@vscode/monaco-editor/esm/vs/platform/contextkey/common/contextkey';
import { IClientCacheTypeNames as CacheTypenames, IContextKeyService, AllContextFragmentDoc,  IAllContextFragment} from '@adminide-stack/core';
import { inject, injectable } from 'inversify';
import { ClientTypes as CommonTypes } from '@common-stack/client-react';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';




class ContextKey<T> implements IContextKey<T> {

    private _service: IContextKeyService;
    private _key: string;
    private _defaultValue: T | undefined;

    constructor(service: IContextKeyService, key: string, defaultValue: T | undefined) {
        this._service = service;
        this._key = key;
        this._defaultValue = defaultValue;
        this.reset();
    }

    public set(value: T): void {
        this._service.setContext(this._key, value);
    }

    public reset(): void {
        if (typeof this._defaultValue === 'undefined') {
            this._service.removeContext(this._key);
        } else {
            this._service.setContext(this._key, this._defaultValue);
        }
    }

    public get(): T | undefined {
        return this._service.getContextKeyValue<T>(this._key);
    }
}

@injectable()
export class ContextKeyService implements IContextKeyService {

    constructor(
        @inject(CommonTypes.InMemoryCache)
        private cache: InMemoryCache,
        @inject(CommonTypes.UtilityClass)
        private utility,
    ) {

    }

    public createKey<T>(key: string, defaultValue: T): IContextKey<T> {

        return new ContextKey(this, key, defaultValue);
    }
    public contextMatchesRules(rules: ContextKeyExpr): boolean {
        if (!rules) {
            return true;
        }
        const context = this.getContext(null);
        return rules.evaluate(context);
    }

    public getContextKeyValue<T>(key: string): T | undefined {
        const fragment = gql`
        fragment Context${key} on Context {
            ${key}
        }
        `;
        return this.cache.readFragment<T>({
            fragment,
            id: this.utility.getCacheKey({ __typename: CacheTypenames.Context }),
        });
    }

    public getContext(target: IContextKeyServiceTarget) {
        const data = this.cache.readFragment<IAllContextFragment>({
            fragment: AllContextFragmentDoc,
            id: this.utility.getCacheKey({ __typename: CacheTypenames.Context }),
        });

        return {
            getValue<T>(key: string) {
                return data[key];
            },
        };
    }

    public setContext<T>(key: string, value: any): void {
        const fragment = gql`
        fragment Context${key}  on Context {
            ${key}
        }
        `;

        const id = this.utility.getCacheKey({ __typename: CacheTypenames.Context });
        const data: T = { } as T;
        data[key] = value;
        this.cache.writeFragment<T>({
            fragment,
            id,
            data: { ...data, __typename: CacheTypenames.Context },
        });
    }

    public removeContext(key: string): void {
        this.setContext(key, null);
    }
}
