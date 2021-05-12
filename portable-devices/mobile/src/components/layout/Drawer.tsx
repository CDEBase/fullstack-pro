import * as React from 'react';
import { Drawer } from 'native-base';
import { Route } from 'react-router-native';
import SideBar from './SideBar';

export const DrawerRoute = ({ match, drawerRef, routes }: any) => {
  const onClose = () => {
    console.log("close")
    drawerRef.current._root.close()
  }

  return (
    <Drawer 
    ref={drawerRef} 
    content={
      <SideBar matchUrl={match.url} routes={routes} />
    }
    onClose={onClose}
    >
      {routes.map((route: any) => (
        <Route key={route.path} exact={route.exact} path={route.path} component={route.component} />
      ))}
    </Drawer>
  )
};
