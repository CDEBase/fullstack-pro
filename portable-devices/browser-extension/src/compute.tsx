import { Feature } from '@common-stack/client-react';
import { ExtensionRoutes } from './enums';
import { Dashboard, Home } from './pages';

export default new Feature({
  routeConfig: [
    {
      [ExtensionRoutes.Dashboard]: {
        exact: true,
        component: Dashboard
      } as any,
      [ExtensionRoutes.Home]: {
        exact: true,
        component: Home
      } as any,
    },
  ],
});
