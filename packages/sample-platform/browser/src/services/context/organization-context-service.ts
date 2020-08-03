

import {
    IOrganizationContextService, IOrganizationResourceCreationData, AbstractOrganizationContextService,
    IMutationupdateOrganizationContextAddResourcesArgs,
    IupdateOrganizationContextUpdateResourcesMutation, IMutationupdateOrganizationContextRemoveResourcesArgs,
    updateOrganizationContextUpdateResourcesMutationResult, updateOrganizationContextUpdateResourcesDocument,
    IMutationupdateOrganizationContextUpdateResourcesArgs,
    OrganizationResourceContextDocument, updateOrganizationContextRemoveResourcesMutationResult,
    IOrganizationResourceContextQuery, updateOrganizationContextRemoveResourcesDocument,
    IQuerygetOrganizationResourceContextArgs,
    updateOrganizationContextAddResourcesDocument, updateOrganizationContextAddResourcesMutationResult, ApplicationState,
    IOrganizationResource,
    OrganizationConfig,
    IOrganizationResourcesChangeEvent,
    IOrganizationIdentifier,
    IOrganizationConfig,
    IClientConfigurationService,
    toOrganizationResources,
} from '@adminide-stack/core';
import { ClientTypes as CommonTypes } from '@common-stack/client-core';
import { ApolloClient } from 'apollo-client';
import { injectable, inject, postConstruct } from 'inversify';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ClientTypes, ILifecycleService, LifecyclePhase } from '@workbench-stack/core';
import { FetchPolicy } from 'apollo-client';
import { URI } from '@vscode/monaco-editor/esm/vs/base/common/uri';
import { IClientContainerService } from '@adminide-stack/core';


@injectable()
export class OrganizationContextService extends AbstractOrganizationContextService implements IOrganizationContextService {

    constructor(
        @inject(ClientTypes.ILifecycleService)
        private lifecycleService: ILifecycleService,
        @inject(CommonTypes.ApolloClient)
        private client: ApolloClient<any>,
        @inject(CommonTypes.InMemoryCache)
        private cache: InMemoryCache,
        @inject(CommonTypes.UtilityClass)
        private utility,
        @inject(CommonTypes.Logger)
        protected logger,
        @inject(IClientContainerService.IConfigurationService)
        protected organizationConfiguration: IClientConfigurationService,

    ) {
        super(logger);
    }

    @postConstruct()
    public async extInitialize() {
        if (!this.organizationConfig) {
            await this.asyncInitializedOrganizationContainer(null);
            // Signal to lifecycle that services are set
            this.lifecycleService.phase = LifecyclePhase.Restored;
        }
    }

    public initialize(args): Promise<any> {
        console.log('willInitWorkspaceService');
        return this.createMultiResourceOrganization(args)
            .then(organizationContext => this.updateWorkspaceAndInitializeConfiguration(organizationContext)).then(() => {
                console.log('didInitWorkspaceService');
            });
    }

    private createMultiResourceOrganization(organizationIdentifier: IOrganizationIdentifier): Promise<OrganizationConfig> {
        return this.getOrganizationContext(organizationIdentifier.id);
    }

    public async updateWorkspaceAndInitializeConfiguration(organizationConfig: OrganizationConfig) {
        const hasOrganizationContextBefore = !!this.organizationConfig;
        let previousState: ApplicationState;
        let previousOrganizationPath: string | undefined;
        let previousResources: IOrganizationResource[];

        if (hasOrganizationContextBefore) {
            previousState = this.getApplicationState();
            previousOrganizationPath = this.organizationConfig.configuration ? this.organizationConfig.configuration.fsPath : undefined;
            previousResources = this.organizationConfig.resources;
            this.organizationConfig.update(organizationConfig);
        } else {
            this.organizationConfig = organizationConfig;
        }

        return this.intializeConfiguration().then(() => {
            // Trigger changes after configuration initialization so that configuration is up to date.
            if (hasOrganizationContextBefore) {
                const newState = this.getApplicationState();
                if (previousState && newState !== previousState) {
                    this._onDidChangeApplicationState.fire(newState);
                }

                const newOrganizationContextPath = this.organizationConfig.configuration ? this.organizationConfig.configuration.fsPath : undefined;
                if (previousOrganizationPath && newOrganizationContextPath !== previousOrganizationPath || newState !== previousState) {
                    this._onDidChangeOrganizationName.fire();
                }

                const resourceChanges = this.compareResources(previousResources, this.organizationConfig.resources);
                if (resourceChanges && (resourceChanges.added.length || resourceChanges.removed.length || resourceChanges.changed.length)) {
                    this._onDidChangeOrganizationResources.fire(resourceChanges);
                }
            }
        })
    }

    private compareResources(currentResources: IOrganizationResource[], newResources: IOrganizationResource[]): IOrganizationResourcesChangeEvent {
        const result = { added: [], removed: [], changed: [] } as IOrganizationResourcesChangeEvent;
        result.added = newResources.filter(newResource => !currentResources.some(currentResource => newResource.uri.toString() === !currentResource.uri.toString()));
        for (let currentIndex = 0; currentIndex < currentResources.length; currentIndex++) {
            let currentResource = currentResources[currentIndex];
            let newIndex = 0;
            for (newIndex = 0; newIndex < newResources.length && currentResource.uri.toString() !== newResources[newIndex].uri.toString(); newIndex++) { }
            if (newIndex < newResources.length) {
                if (currentIndex !== newIndex || currentResource.name !== newResources[newIndex].name) {
                    result.changed.push(currentResource);
                } else {
                    result.removed.push(currentResource);
                }
            }
        }
        return result;
    }

    private intializeConfiguration(): Promise<void> {
        console.log('---InitializeConfiguration ----');
        return Promise.resolve();
    }
    private async asyncInitializedOrganizationContainer(orgId, opts: { fetchPolicy: FetchPolicy } = { fetchPolicy: 'cache-first' }) {
        this.lifecycleService.when(LifecyclePhase.Ready).then(() => {
            this.getOrganizationContext(orgId, opts).then((organizationContext) => this.organizationConfig = organizationContext)
        })
    }

    private async getOrganizationContext(orgId: string, opts: { fetchPolicy: FetchPolicy } = { fetchPolicy: 'cache-first' }) {
        return this.client.query<IOrganizationResourceContextQuery, IQuerygetOrganizationResourceContextArgs>({
            query: OrganizationResourceContextDocument,
            variables: { orgId },
            fetchPolicy: opts.fetchPolicy,
        }).then(({ data: { getOrganizationResourceContext } }) => this.reviveOrganizationUris(getOrganizationResourceContext))
    }

    public async addResources(resourcesToAdd: IOrganizationResourceCreationData[], index?: number): Promise<void> {

        this.client.mutate<updateOrganizationContextAddResourcesMutationResult, IMutationupdateOrganizationContextAddResourcesArgs>({
            mutation: updateOrganizationContextAddResourcesDocument,
            variables: { resourcesToAdd, index }
        })
    }

    public async removeResources(resourcesToRemove: URI[]): Promise<void> {
        this.client.mutate<updateOrganizationContextRemoveResourcesMutationResult, IMutationupdateOrganizationContextRemoveResourcesArgs>({
            mutation: updateOrganizationContextRemoveResourcesDocument,
            variables: { resourcesToRemove }
        });
    }
    public async updateResources(resourcesToAdd: IOrganizationResourceCreationData[], resourcesToRemove: URI[], index?: number): Promise<void> {
        this.client.mutate<updateOrganizationContextUpdateResourcesMutationResult, IMutationupdateOrganizationContextUpdateResourcesArgs>({
            mutation: updateOrganizationContextUpdateResourcesDocument,
            variables: { resourcesToAdd, resourcesToRemove, index }
        })
    }
}