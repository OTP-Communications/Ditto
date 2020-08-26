import React from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {useObservableState} from 'observable-hooks';
import {matrix} from '@rn-matrix/core';
import AuthScreen from './scenes/auth/AuthScreen';

export default function AppNavigator() {
  const authLoaded = useObservableState(matrix.authIsLoaded$());
  const authLoggedIn = useObservableState(matrix.isLoggedIn$());
  const matrixReady = useObservableState(matrix.isReady$());

  if (!authLoaded || (authLoggedIn && !matrixReady)) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else if (authLoggedIn) {
    return <AuthScreen />;
  } else {
    return (
      <View>
        <Text>loginnnn</Text>
      </View>
    );
  }
}
