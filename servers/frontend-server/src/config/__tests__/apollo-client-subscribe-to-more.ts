import { Operation } from '@apollo/client';
import { mockObservableLink,mockSingleLink } from '@apollo/client/testing';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { DocumentNode, OperationDefinitionNode } from 'graphql';
import gql from 'graphql-tag';

const isSub = (operation: Operation) =>
	(operation.query ).definitions
		.filter((x) => x.kind === 'OperationDefinition')
		.some((x: OperationDefinitionNode) => x.operation === 'subscription');

describe('subscribeToMore', () => {
	const query = gql`
		query aQuery {
			entry {
				value
			}
		}
	`;
	const result = {
		data: {
			entry: {
				value: '1',
			},
		},
	};

	const req1 = { request: { query } as Operation, result };

	const results = ['Dahivat Pandya', 'Amanda Liu'].map((name) => ({
		result: { data: { name } },
		delay: 10,
	}));

	const results2 = [
		{ result: { data: { name: 'Amanda Liu' } }, delay: 10 },
		{ error: new Error('You cant touch this'), delay: 10 },
	];

	const results3 = [
		{ error: new Error('You cant touch this'), delay: 10 },
		{ result: { data: { name: 'Amanda Liu' } }, delay: 10 },
	];

	const result4 = {
		data: {
			entry: [{ value: '1' }, { value: '2' }],
		},
	};
	const req4 = { request: { query } as Operation, result: result4 };
});
