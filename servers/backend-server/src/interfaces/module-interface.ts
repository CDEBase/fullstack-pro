import { GraphQLSchema } from 'graphql';
import { CdmLogger } from '@cdm-logger/core';
type ILogger = CdmLogger.ILogger;


export interface IModuleService {
    serviceContainer: any;
    serviceContext: any;
    dataSource: any;
    defaultPreferences: any;
    createContext: any;
    schema: GraphQLSchema;
    logger: ILogger;
}


