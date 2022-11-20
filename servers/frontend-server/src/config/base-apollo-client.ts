// version 09/18/2021
 
 
 
import { ApolloClient, ApolloClientOptions, ApolloLink } from '@apollo/client';
import { InMemoryCache } from '@apollo/client/cache';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { onError } from '@apollo/client/link/error';
import { createHttpLink,HttpLink } from '@apollo/client/link/http';
import { RetryLink } from '@apollo/client/link/retry';
import { WebSocketLink } from '@apollo/client/link/ws';
import { CdmLogger } from '@cdm-logger/core';
import { IClientState } from '@common-stack/client-core';
import { getOperationAST } from 'graphql';
import { isBoolean, merge } from 'lodash';
import fetch from 'node-fetch';
import { ConnectionParams } from 'subscriptions-transport-ws';
import { invariant } from 'ts-invariant';

const schema = `

`;

interface IApolloClientParams {
	clientState: IClientState;
	getDataIdFromObject: (x?: any) => string;
	httpGraphqlURL: string;
	httpLocalGraphqlURL: string;
	initialState?: any;
	isDebug: boolean;
	isDev: boolean;
	isSSR: boolean;
	logger: CdmLogger.ILogger;
	scope: 'browser' | 'server' | 'native';
}

const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors) {
		graphQLErrors.map(({ message, locations, path }) =>
			// tslint:disable-next-line
			invariant.warn(
				`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
			)
		);
	}
	if (networkError) {
		// tslint:disable-next-line
		invariant.warn(`[Network error]: ${networkError}`);
	}
});

let _apolloClient: ApolloClient<any>;
let _memoryCache: InMemoryCache;
export const createApolloClient = ({
	scope,
	isDev,
	isDebug,
	isSSR,
	getDataIdFromObject,
	clientState,
	httpGraphqlURL,
	httpLocalGraphqlURL,
	initialState,
	logger,
}: IApolloClientParams) => {
	const isBrowser = scope === 'browser';
	const isServer = scope === 'server';
	let link;

	const cache = new InMemoryCache({
		dataIdFromObject: getDataIdFromObject,
		possibleTypes: clientState.possibleTypes,
	});

	const attemptConditions = async (
		count: number,
		operation: any,
		error: Error
	) => {
		const promises = (clientState.retryLinkAttemptFuncs || []).map((func) =>
			func(count, operation, error)
		);

		try {
			const result = await promises;
			return !!result.find((item) => item && isBoolean(item));
		} catch (e) {
			logger.trace('Error occured in retryLink Attempt condition', e);
			throw e;
		}
	};

	const retrylink = new RetryLink({
		attempts: attemptConditions,
	});

	if (_apolloClient && _memoryCache) {
		// return quickly if client is already created.
		return {
			apolloClient: _apolloClient,
			cache: _memoryCache,
		};
	}
	_memoryCache = cache;
	if (isBrowser) {
		const connectionParams = async () => {
			const param: ConnectionParams = {};
			for (const connectionParam of clientState.connectionParams) {
				merge(param, await connectionParam);
			}
			return param;
		};

		const wsLink = new WebSocketLink({
			uri: httpGraphqlURL.replace(/^http/, 'ws'),
			options: {
				reconnect: true,
				timeout: 20000,
				reconnectionAttempts: 10,
				lazy: true,
				connectionParams,
				connectionCallback: async (error, result) => {
					if (error) {
						logger.error(error, '[WS connectionCallback error] %j');
					}
					const promises = (clientState.connectionCallbackFuncs || []).map(
						(func) => func(wsLink, error, result)
					);
					try {
						await promises;
					} catch (e) {
						logger.trace('Error occured in connectionCallback condition', e);
						throw e;
					}
				},
			},
			inactivityTimeout: 10000,
		});

		link = ApolloLink.split(
			({ query, operationName }) => {
				if (operationName.endsWith('_WS')) {
					return true;
				}
				const operationAST = getOperationAST(query as any, operationName);
				return !!operationAST && operationAST.operation === 'subscription';
			},
			wsLink,
			new HttpLink({
				uri: httpGraphqlURL,
			})
		);
	} else if (isServer) {
		link = new BatchHttpLink({ uri: httpLocalGraphqlURL, fetch: fetch as any });
	} else {
		link = createHttpLink({ uri: httpLocalGraphqlURL, fetch: fetch as any });
	}

	const links = [errorLink, retrylink, ...(clientState.preLinks || []), link];

	// Add apollo logger during development only
	if (isBrowser && (isDev || isDebug)) {
		const apolloLogger = require('apollo-link-logger');
		links.unshift(apolloLogger.default);
	}

	const params: ApolloClientOptions<any> = {
		queryDeduplication: true,
		typeDefs: schema.concat(<string>clientState.typeDefs),
		resolvers: clientState.resolvers as any,
		link: ApolloLink.from(links),
		cache,
		connectToDevTools: isBrowser && (isDev || isDebug),
	};
	if (isSSR) {
		if (isBrowser) {
			if (initialState) {
				cache.restore(initialState);
			}
			params.ssrForceFetchDelay = 100;
		} else if (isServer) {
			params.ssrMode = true;
		}
	}
	_apolloClient = new ApolloClient<any>(params);

	clientState?.defaults?.forEach((x) => {
		if (x.type === 'query') {
			cache.writeQuery(x);
		} else if (x.type === 'fragment') {
			cache.writeFragment(x);
		}
	});

	return { apolloClient: _apolloClient, cache };
};
