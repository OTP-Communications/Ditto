require('node-libs-react-native/globals');
import 'react-native-url-polyfill/auto';
import 'react-native-gesture-handler';

import React from 'react';
import {matrix} from '@rn-matrix/core';
import {
  DarkTheme as darkNavTheme,
  NavigationContainer,
} from '@react-navigation/native';
import AppNavigator from './mobile/AppNavigator';

matrix.initAuth();

const App = () => {
  return (
    <NavigationContainer theme={darkNavTheme}>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;
