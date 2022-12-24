/* eslint-disable class-methods-use-this */
/* eslint-disable no-useless-constructor */
/* eslint-disable import/no-extraneous-dependencies */
import * as fs from 'fs';
import { GraphQLSchema, OperationDefinitionNode } from 'graphql';
import { stitchSchemas } from '@graphql-tools/stitch';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { linkToExecutor } from '@graphql-tools/links';
import { introspectSchema, wrapSchema } from '@graphql-tools/wrap';
// import { transformSchema } from '@graphql-tools/delegate';
import * as ws from 'ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { split } from '@apollo/client';
import { logger } from '@common-stack/server-core';
import { HttpLink } from '@apollo/client/link/http';
import * as fetch from 'isomorphic-fetch';
import { CdmLogger } from '@cdm-logger/core';
import { remoteSchemaDetails } from './remote-config';
import rootSchemaDef from './root-schema.graphqls';
import { resolvers as rootResolver } from './resolver';
import { attachDirectiveResolvers } from './utils';

interface IGraphqlOptions {
    schema: string | string[];
    resolvers: any;
    directives: any[];
    directiveResolvers: { [key: string]: any};
    logger: CdmLogger.ILogger;
}
export class GatewaySchemaBuilder {
    constructor(private options: IGraphqlOptions) {}

    public async build(): Promise<GraphQLSchema> {
        let gatewaySchema;
        let ownSchema;
        try {
            ownSchema = this.createOwnSchema();
            const remoteSchema = await this.load();
            // techSchema = this.patchSchema(techSchema, 'TechService');

            gatewaySchema = stitchSchemas({
                subschemas: [ownSchema],
            });
            // TODO after updating graphql-tools to v8
            // addErrorLoggingToSchema(schema, { log: (e) => logger.error(e as Error) });
        } catch (err) {
            logger.error('[Graphql Schema Errors] when building schema:', err.message);
            gatewaySchema = ownSchema;
        }

        return gatewaySchema;
    }

    private async load() {
        const schemas = [];
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < remoteSchemaDetails.length; i++) {
            // eslint-disable-next-line no-await-in-loop
            const schema = await this.loadRemoteSchema(remoteSchemaDetails[i]);
            schemas.push(schema);
        }
        return schemas;
    }

    private async createRemoteSchema(service: string, iteration?: number): Promise<GraphQLSchema> {
        logger.info('Fetch service [%s] iteration [%s]', service, iteration);
        const services = remoteSchemaDetails;
        if (!services.length) {
            console.warn(`Service ${services} is undefined`);
            if (iteration && iteration > 2) {
                return Promise.reject(`tried upto ${iteration} attempts, now failing...`);
            }
            return new Promise<GraphQLSchema>((resolve, reject) => {
                const timeout = iteration ? 1000 * iteration : 1000;
                logger.info('Wait for service startup %s', timeout);
                setTimeout(() => {
                    this.createRemoteSchema(service, iteration ? iteration + 1 : 1)
                        .then(resolve)
                        .catch(reject);
                }, timeout);
            });
        }
        // instead need to loop it
        // https://github.com/j-colter/graphql-gateway/blob/9c64d90a74727d2002d10b06f47e1f4a316070fc/src/schema.js#L50
        const url = services[0].uri;
        logger.info('fetch service [%s]', url);
        // 1. Create apollo Link that's connected to the underlying GraphQL API
        const link = new HttpLink({ uri: url, fetch });
        const executor: any = linkToExecutor(link);
        // 2. Retrieve schema definition of the underlying GraphQL API
        const remoteSchema = await introspectSchema(link as any);

        // 3. Create the executable schema based on schema definition and Apollo Link
        return wrapSchema({
            schema: remoteSchema,
            executor,
        });
    }

    private async loadRemoteSchema({ uri, wsUri }) {
        try {
            const httpLink = new HttpLink({ uri, fetch });
            let link = null;

            if (wsUri) {
                const wsLink = new WebSocketLink({
                    uri: wsUri,
                    options: {
                        reconnect: true,
                    },
                    webSocketImpl: ws,
                });
                link = split(
                    // split based on operatino type
                    ({ query }) => {
                        const { kind, operation } = getMainDefinition(query) as OperationDefinitionNode;
                        return kind === 'OperationDefinition' && operation === 'subscription';
                    },
                    wsLink,
                    httpLink,
                );
            } else {
                link = httpLink;
            }
            const executor: any = linkToExecutor(link);
            const remoteSchema = await introspectSchema(link);
            const executableSchema = wrapSchema({
                schema: remoteSchema,
                executor,
            });
            return executableSchema;
        } catch (err) {
            this.options.logger.error('fetching schema error: ', err);
            return {};
        }
    }

    // disabled after updating to apollo-client to v3 and graphql-tools to v8
    // private patchSchema(schema: GraphQLSchema, systemName: string) {
    //     return transformSchema(schema, [
    //         new RenameTypes((name: string) => (name === 'StatusInfo' ? `${systemName}StatusInfo` : undefined)),
    //         new RenameRootFields((_operation: string, name: string) =>
    //             name === 'status'
    //                 ? `${systemName.substring(0, 1).toLowerCase()}${systemName.substring(1)}Status`
    //                 : name,
    //         ),
    //     ]);
    // }

    private createOwnSchema(): GraphQLSchema {
        const typeDefs = [rootSchemaDef, this.options.schema].join('\n');
        if (__DEV__) {
            import('../modules/module').then(
                ({ ExternalModules }) => {
                    const externalSchema = ExternalModules.schemas;
                    const writeData = `${externalSchema}`;
                    fs.writeFileSync('./generated-schema.graphql', writeData);
                }
            )
        }
        let mergedSchema =  makeExecutableSchema({
            resolvers: [rootResolver, this.options.resolvers],
            typeDefs,
            resolverValidationOptions: {
                requireResolversForResolveType: 'warn',
            },
        });
        // mergedSchema = this.options.directives.reduce((curSchema,transform) => transform(curSchema), mergedSchema);
        if (this.options.directiveResolvers && Object.keys(this.options.directiveResolvers).length !== 0 ) {
            this.options.logger.warn('directiveResolvers deprecated replaced with directives');
            mergedSchema = attachDirectiveResolvers(mergedSchema, this.options.directiveResolvers);
        }
        return mergedSchema;
    }
}
