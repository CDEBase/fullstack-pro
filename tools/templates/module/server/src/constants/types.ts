export const TYPES = {
	ActivityStorage: 'ActivityStorage',
	ActivityCollector: 'ActivityCollector',
	ActivityDBConnection: 'ActivityDBConnection',
};

export enum EActivityScopes {
	Cluster = 'cluster',
	Default = 'default',
	Organization = 'organization',
	Team = 'team',
	User = 'user',
	Workspace = 'workspace'
}

export const MODELS = {
	ActivityStorageModel: 'ActivityStorageModel',
};

export enum HemeraTopics {
	ActivityCollector = 'ActivityCollector',
	ActivityStorage = 'ActivityStorage'
}

export enum HemeraCommands {
	Collect = 'Collect',

	StorageDelete = 'StorageDelete',
	StorageGet = 'StorageGet',
	StorageGetActive = 'StorageGetActive',

	StorageGetInactive = 'StorageGetInactive',
	StorageSet = 'StorageSet'
}
