import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {matrix} from '@rn-matrix/core';
import AppNavigator from './web/AppNavigator';

matrix.initAuth();

const {height} = Dimensions.get('screen');

const App = () => {
  return (
    <View style={styles.container}>
      <AppNavigator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height,
  },
});

export default App;
