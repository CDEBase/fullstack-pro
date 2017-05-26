import ApolloClient, { NetworkInterface, FragmentMatcherInterface } from 'apollo-client';


type Options = {
    networkInterface?: NetworkInterface;
    reduxRootSelector?: string;
    initialState?: any;
    dataIdFromObject?: any;
    ssrMode?: boolean;
    ssrForceFetchDelay?: number;
}

const createApolloClient = networkInterface => {
    const params: Options = {
        dataIdFromObject: (result) => {
            if (result.id && result.__typename) {
                return result.__typename + result.id;
            }
            return null;
        },
        networkInterface,
    };
    return new ApolloClient(params);
};

export default createApolloClient;