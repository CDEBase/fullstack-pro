

import * as ILogger from 'bunyan';
import { GraphQLSchema } from 'graphql';



export interface IModuleService {
    serviceContainer: any;
    serviceContext: any;
    dataSource: any;
    defaultPreferences: any;
    createContext: any;
    schema: GraphQLSchema;
    logger: ILogger;
}


