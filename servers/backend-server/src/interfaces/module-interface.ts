import { CdmLogger } from '@cdm-logger/core';
import { GraphQLSchema } from 'graphql';
type ILogger = CdmLogger.ILogger;

export interface IModuleService {
	createContext: any;
	dataSource: any;
	defaultPreferences: any;
	logger: ILogger;
	schema: GraphQLSchema;
	serviceContainer: any;
	serviceContext: any;
}
