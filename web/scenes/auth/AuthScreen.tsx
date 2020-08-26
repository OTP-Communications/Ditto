import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function AuthScreen() {
  return (
    <View style={styles.wrapper}>
      <Text>login</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'red',
  },
});
