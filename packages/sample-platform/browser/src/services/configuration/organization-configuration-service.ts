
import { injectable, inject, postConstruct } from 'inversify';
import { ApolloClient } from 'apollo-client';
import { ClientTypes as CommonTypes } from '@common-stack/client-core';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { FetchPolicy } from 'apollo-client';
import {merge } from 'lodash';
import { ConfigurationTarget, IConfigurationOverrides, AbstractOrganizationConfigurationClientService,
    IClientConfigurationService, UpdateConfigurationValueDocument, IUpdateConfigurationValueMutationVariables,
    getConfigurationDataDocument, IgetConfigurationDataQuery, IUpdateConfigurationValueMutation,
} from '@adminide-stack/core';
import { ClientTypes, ILifecycleService, LifecyclePhase } from '@workbench-stack/core';

@injectable()
export class ConfigurationService extends AbstractOrganizationConfigurationClientService implements IClientConfigurationService {

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
    ) {
        super(logger);
    }

    @postConstruct()
    public async extInitialize() {
        if (!this.configuration) {
            await this.asyncInitializedConfigurationContainer();
        }
    }

    private async asyncInitializedConfigurationContainer(opts: { fetchPolicy: FetchPolicy } = { fetchPolicy: 'cache-first' }) {
        this.lifecycleService.when(LifecyclePhase.Ready).then(async () => {
            const { data: { getConfigurationData } } = await this.client.query<IgetConfigurationDataQuery>({
                query: getConfigurationDataDocument,
                fetchPolicy: opts.fetchPolicy,
            });
            const { defaults, resources, user, organization } = getConfigurationData;
            const convertedResource = resources.reduce((acc, curr) => {
                return merge(acc, { [curr.id]: curr });
            }, {});
            this.configuration = AbstractOrganizationConfigurationClientService.parse({ defaults, resources: convertedResource as any, user, organization });
        });
    }

    public updateValue(key: string, value: any): Promise<void>;
    public updateValue(key: string, value: any, overrides: IConfigurationOverrides): Promise<void>;
    public updateValue(key: string, value: any, target: ConfigurationTarget): Promise<void>;
    public updateValue(key: string, value: any, overrides: IConfigurationOverrides, target: ConfigurationTarget): Promise<void>;
    public updateValue(key: string, value: any, overrides: IConfigurationOverrides, target: ConfigurationTarget, donotNotifyError: boolean): Promise<void>;
    public async updateValue(key: string, value: any, arg3?: any, arg4?: any, donotNotifyError?: any): Promise<void> {
        await this.client.mutate<IUpdateConfigurationValueMutation, IUpdateConfigurationValueMutationVariables>({
            mutation: UpdateConfigurationValueDocument,
            variables: {
                key,
                value,
                overrides: arg3,
                target: arg4,
                donotNotifyError
            },
        });
    }

    public async reloadConfiguration() {
        await this.asyncInitializedConfigurationContainer({ fetchPolicy: 'network-only' });
    }
}
