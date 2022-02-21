import { ApolloLink, Operation, FetchResult, Observable } from '@apollo/client/core';
import { createClient, ClientOptions, Client } from 'graphql-ws';
import { GraphQLError, print } from 'graphql';

export class WebSocketLink extends ApolloLink {
    private client: Client;

    constructor(options: ClientOptions) {
        super();
        this.client = createClient(options);
    }

    public request(operation: Operation): Observable<FetchResult> {
        return new Observable((sink) =>
            this.client.subscribe<FetchResult>(
                { ...operation, query: print(operation.query) },
                {
                    next: sink.next.bind(sink),
                    complete: sink.complete.bind(sink),
                    error: (err) => {
                        if (err instanceof Error) {
                            return sink.error(err);
                        }

                        if (err instanceof CloseEvent) {
                            return sink.error(
                                // reason will be available on clean closes
                                new Error(`Socket closed with event ${err.code} ${err.reason || ''}`),
                            );
                        }

                        return sink.error(new Error((err as GraphQLError[]).map(({ message }) => message).join(', ')));
                    },
                },
            ),
        );
    }
}
