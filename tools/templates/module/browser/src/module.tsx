import { Feature } from '@common-stack/client-react';
import { $Module$_NAMESPACE, $Module$_API_ROUTES } from './constants';


export default new Feature({
  routeConfig: [{
    [$Module$_API_ROUTES.$Module$_ROOT]: { component: RepositoriesContainer },
  }],
});

