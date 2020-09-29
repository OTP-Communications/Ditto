require('node-libs-react-native/globals');
import 'react-native-url-polyfill/auto';
import 'react-native-gesture-handler';
import '@rn-matrix/core/shim';

import React, {useContext} from 'react';
import {matrix, matrixSdk} from '@rn-matrix/core';
import {
  DefaultTheme,
  DarkTheme,
  NavigationContainer,
} from '@react-navigation/native';
import AppNavigator from './mobile/AppNavigator';
import {ThemeContext} from './shared/themes/ThemeProvider';
import {StatusBar} from 'react-native';
import r from 'xmlhttp-request';

matrixSdk.request(r);

console.log('request ', matrixSdk.getRequest());

console.disableYellowBox = true;

matrix.initAuth();

const App = () => {
  const {themeId} = useContext(ThemeContext);
  if (themeId === 'light') {
    StatusBar.setBarStyle('dark-content');
  } else {
    StatusBar.setBarStyle('light-content');
  }
  return (
    <NavigationContainer theme={themeId === 'light' ? DefaultTheme : DarkTheme}>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;
