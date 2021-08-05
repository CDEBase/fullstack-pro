import React, { useRef } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import MainHeader from './Header';
import { DrawerRoute } from './Drawer';

const Layout = (props: any, route: any) => {
  const drawerRef = useRef();
  return (
    <View style={{ flex: 1 }}>
      <MainHeader title="CDMBase LLC" drawerRef={drawerRef} />
      <DrawerRoute match={props.match} routes={route.routes || []} drawerRef={drawerRef}/>
    </View>
  );
};

export const ProLayout = connect((state: any) => {
  return {
    settings: state.settings,
    location: state.router.location,
  };
})(Layout);

export default Layout;
