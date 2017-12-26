
import Expo from 'expo';
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import App from './App';

// we don't want this to require transformation
class AwakeInDevApp extends React.Component {
  static propTypes = {
    exp: PropTypes.object
  };

  render() {
    return React.createElement(
      View,
      {
        style: {
          flex: 1
        }
      },
      React.createElement(App),
      React.createElement(process.env.NODE_ENV === 'development' ? Expo.KeepAwake : View)
    );
  }
}

Expo.registerRootComponent(AwakeInDevApp);