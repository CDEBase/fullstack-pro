import { navigationRef } from '@common-stack/client-react';

export function navigate(name: string, params: never) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name as never, params);
    }
}
