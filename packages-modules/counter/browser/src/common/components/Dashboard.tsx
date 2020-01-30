import * as React from 'react';
import { renderRoutes } from 'react-router-config';

export const Dashboard = (props) =>  <>{renderRoutes(props.route.routes, { matchPath: props.route.path })}</>;
