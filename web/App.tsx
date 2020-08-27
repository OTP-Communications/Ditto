import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import AppNavigator from './AppNavigator';

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
