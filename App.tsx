require('node-libs-react-native/globals');
import 'react-native-url-polyfill/auto';
import 'react-native-gesture-handler';
import '@rn-matrix/core/shim';

import React, {useContext, useEffect} from 'react';
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
import * as Sentry from '@sentry/react-native';
import {SENTRY_DSN} from '@env';
import {AppContext} from './shared/context/AppContext';
import {navigationRef} from './mobile/services/navigator';

global.location = {
  protocol: 'file:',
  href: '',
};

console.disableYellowBox = true;

matrix.initAuth();

const App = () => {
  const {themeId} = useContext(ThemeContext);
  const {errorReportingEnabled} = useContext(AppContext);

  useEffect(() => {
    matrixSdk.request(r);

    Sentry.init({
      dsn: SENTRY_DSN,
      beforeSend(event) {
        console.log('event', event, errorReportingEnabled);
        if (errorReportingEnabled) return event;
        return null;
      },
    });
  }, []);

  useEffect(() => {
    Sentry.init({
      dsn: SENTRY_DSN,
      beforeSend(event) {
        if (errorReportingEnabled) return event;
        return null;
      },
    });
  }, [errorReportingEnabled]);

  if (themeId === 'light') {
    StatusBar.setBarStyle('dark-content');
  } else {
    StatusBar.setBarStyle('light-content');
  }
  return (
    <NavigationContainer
      ref={navigationRef}
      theme={themeId === 'light' ? DefaultTheme : DarkTheme}>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;
