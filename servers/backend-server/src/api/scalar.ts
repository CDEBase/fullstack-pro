// add any scalar types
import { GraphQLError, GraphQLScalarType, Kind } from 'graphql';

// https://stackoverflow.com/questions/41557536/custom-map-keys-in-graphql-response
export const GraphQLAnyObject = new GraphQLScalarType({
    name: 'AnyObject',
    description: 'Any JSON object. This type bypasses type checking.',
    serialize: (value) => value,
    parseValue: (value) => value,
    parseLiteral: (ast) => {
        if (ast.kind !== Kind.OBJECT) {
            throw new GraphQLError(`Query error: Can only parse object but got a: ${ast.kind}`, [ast]);
        }
        return ast.value;
    },
});
