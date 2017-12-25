import Expo from 'expo';
import * as React from 'react';
// import PropTypes from 'prop-types';
import { View } from 'react-native';
import App from './App';

type Props = {
  exp: any;
};
type State = {
  isReady: boolean,
};
// we don't want this to require transformation
class AwakeInDevApp extends React.Component<Props, State> {
  // static propTypes = {
  //   exp: PropTypes.object
  // };
  public state: State = {
    isReady: false,
  };

  public async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      Ionicons: require('@expo/vector-icons/fonts/Ionicons.ttf'),
    });

    this.setState({ isReady: true });
  }

  public render() {
    if (!this.state.isReady) {
      return <Expo.AppLoading />;
    }

    return React.createElement(
      View,
      {
        style: {
          flex: 1,
        },
      },
      React.createElement(App, { expUri: this.props.exp ? this.props.exp.initialUri : null }),
      React.createElement(process.env.NODE_ENV === 'development' ? Expo.KeepAwake : View),
    );
  }
}

Expo.registerRootComponent(AwakeInDevApp);
