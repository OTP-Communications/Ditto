require('node-libs-react-native/globals');

import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {matrix} from '@rn-matrix/core';
import {useObservableState} from 'observable-hooks';

matrix.initAuth();

const {height} = Dimensions.get('screen');

const App = () => {
  const isReady = useObservableState(matrix.authIsLoaded$());
  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Text>Hello React Native Web!!! {isReady ? 'true' : 'false'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
