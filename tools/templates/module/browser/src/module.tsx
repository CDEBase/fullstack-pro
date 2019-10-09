import * as React from 'react';
import { Feature } from '@common-stack/client-react';
import { Route } from 'react-router-dom';
import $Module$ from './components/$Module$';
import { gitLink } from './link';
import { $Module$_NAMESPACE, $Module$_API_ROUTES } from './constants';


export default new Feature({
  routeConfig: [{
    [$Module$_API_ROUTES.$Module$_ROOT]: { component: RepositoriesContainer },
  }],
});

