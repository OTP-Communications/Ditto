/**
 * @format
 */
import './shared/i18n';

import React from 'react';
import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import ThemeProvider, {ThemeContext} from './shared/themes/ThemeProvider';
import AppContextProvider from './shared/context/AppContext';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';

const debug = require('debug');
debug.enable('ditto:*,rnm:*');

function AppWrapper() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ThemeProvider>
        <AppContextProvider>
          <ThemeContext.Consumer>
            {({theme}) => (
              <ApplicationProvider {...eva} theme={theme}>
                <App />
              </ApplicationProvider>
            )}
          </ThemeContext.Consumer>
        </AppContextProvider>
      </ThemeProvider>
    </>
  );
}

AppRegistry.registerComponent(appName, () => AppWrapper);
if (Platform.OS === 'web') {
  AppRegistry.runApplication(appName, {
    initialProps: {},
    rootTag: document.getElementById('root'),
  });
}
