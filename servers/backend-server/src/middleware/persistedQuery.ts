import { invert, isArray } from 'lodash';
import { GRAPHIQL_ROUTE } from '../ENDPOINTS';

const queryMap = require('@sample-stack/graphql/extracted_queries.json');

export const persistedQueryMiddleware = (req, res, next) => {
    const invertedMap = invert(queryMap);

    if (isArray(req.body)) {
        req.body = req.body.map(body => {
            const id = body['id'];
            return {
                query: invertedMap[id],
                ...body,
            };
        });
        next();
    } else {
        if (!__DEV__ || (req.get('Referer') || '').indexOf(GRAPHIQL_ROUTE) < 0) {
            res.status(500).send('Unknown GraphQL query has been received, rejecting...');
        } else {
            next();
        }
    }
};

