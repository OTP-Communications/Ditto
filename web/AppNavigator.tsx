import React from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {useObservableState} from 'observable-hooks';
import {matrix} from '@rn-matrix/core';
import AuthScreen from './scenes/auth/AuthScreen';
import {Layout} from '@ui-kitten/components';

export default function AppNavigator() {
  const authLoaded = useObservableState(matrix.authIsLoaded$());
  const authLoggedIn = useObservableState(matrix.isLoggedIn$());
  const matrixReady = useObservableState(matrix.isReady$());

  if (!authLoaded || (authLoggedIn && !matrixReady)) {
    return (
      <Layout
        level="3"
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </Layout>
    );
  } else if (authLoggedIn) {
    return (
      <View>
        <Text>app</Text>
      </View>
    );
  } else {
    return <AuthScreen />;
  }
}
