import React from 'react';
import {StyleSheet, View} from 'react-native';

export default function MessageWrapper({children, ...props}) {
  const {isMe, nextSame} = props;
  return (
    <View
      style={[
        styles.wrapper,
        {
          alignItems: isMe ? 'flex-end' : 'flex-start',
          marginBottom: nextSame ? 3 : 12,
        },
      ]}>
      <View style={{maxWidth: '85%'}}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {},
});
