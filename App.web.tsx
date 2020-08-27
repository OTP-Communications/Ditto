import React from 'react';
import {matrix} from '@rn-matrix/core';
import AppNavigator from './web/AppNavigator';
import {Dimensions, View} from 'react-native';

matrix.initAuth();

const {height} = Dimensions.get('window');

export default function App() {
  return (
    <View style={{height}}>
      <AppNavigator />
    </View>
  );
}
