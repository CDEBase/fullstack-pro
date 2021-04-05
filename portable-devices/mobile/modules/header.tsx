import React from 'react'
import {Header} from "react-native-elements"
import { DrawerActions } from '@react-navigation/native';

const MainHeader = (props: any) => {
  const Dispatch = props.navigation.navigationRef.current.dispatch
    return (
        <Header 
        placement='left' 
        leftComponent={{
          icon: 'menu', 
          color: '#fff', 
          onPress: () => Dispatch(DrawerActions.toggleDrawer())
        }}
        centerComponent={{
          text: props.title, 
          style:{color: "#fff"}
        }}
        />
    )
}

export default MainHeader