import * as React from 'react';
import { renderRoutes2 as renderRoutes } from '@common-stack/client-react';

export default (props) =>  <>{renderRoutes(props.route.routes)}</>;
