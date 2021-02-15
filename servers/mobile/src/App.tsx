import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

class App extends React.Component {
  render(){
    return (
      <View style={styles.container}>
        <Text>Open up App.tsx to start working on your app!</Text>
      </View>
    );
  }
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/* try {
  Object.assign(global, require('../build.config'));

  // tslint:disable-next-line
  const modules = require('./modules').default;
  (async () => {
    await modules.createApp(module);
  })();
} catch (e) {
  if (typeof ErrorUtils !== 'undefined') {
    (ErrorUtils as any).reportFatalError(e);
  } else {
    console.error(e);
  }
}
 */