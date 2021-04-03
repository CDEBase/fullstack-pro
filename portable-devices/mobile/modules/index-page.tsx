import * as React from 'react';
import { StatusBar } from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from '@ant-design/react-native';
import HomeScreen from '../tabs/HomeScreen';

const {Navigator, Screen} = createBottomTabNavigator();


function IndexPage() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <Navigator>
          <Screen
            name="主页"
            options={({route}) => ({
              tabBarIcon: ({focused, color, size}) => {
                // You can return any component that you like here!
                return <Icon size={size} name="home" color={color} />;
              },
            })}
            component={HomeScreen}
          />
          <Screen
            name="我的"
            options={({route}) => ({
              tabBarIcon: ({focused, color, size}) => {
                // You can return any component that you like here!
                return <Icon size={size} name="profile" color={color} />;
              },
            })}
            component={ProfileScreen}
          />
        </Navigator>
      </>
    );
  }
  
  IndexPage.title = '首页';
  IndexPage.headerTintColor = '#ffffff';
  IndexPage.headerTitleStyle = {
    fontWeight: 'bold',
  };
  IndexPage.headerStyle = {
    backgroundColor: '#000000',
  };
  
  export default IndexPage;
