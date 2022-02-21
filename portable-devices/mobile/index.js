/* eslint-disable jest/require-hook */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
import { registerRootComponent } from 'expo';
import 'text-encoding-polyfill'; // to fix App Crash due to reference to TextEncoder
import 'react-native-reanimated'; // to fix web crash

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
