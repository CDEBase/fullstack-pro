import { Feature } from '@common-stack/client-react-native';
import { ProLayout } from './Layout';

export default new Feature({
    routeConfig: [
        {
            '/': {
                exact: false,
                component: ProLayout,
                key: 'layout',
            },
        },
    ],
});
