export const TYPES = {
    ActivityStorage: 'ActivityStorage',
    ActivityCollector: 'ActivityCollector',
    ActivityDBConnection: 'ActivityDBConnection',
};

export enum EActivityScopes {
    User = 'user',
    Team = 'team',
    Cluster = 'cluster',
    Default = 'default',
    Workspace = 'workspace',
    Organization = 'organization',
}

export const MODELS = {
    ActivityStorageModel: 'ActivityStorageModel',
};

export enum HemeraTopics {
    ActivityStorage = 'ActivityStorage',
    ActivityCollector = 'ActivityCollector',
}

export enum HemeraCommands {
    Collect = 'Collect',

    StorageSet = 'StorageSet',
    StorageGet = 'StorageGet',
    StorageDelete = 'StorageDelete',

    StorageGetActive = 'StorageGetActive',
    StorageGetInactive = 'StorageGetInactive',
}
