import {useObservableState} from 'observable-hooks';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import Reactions from './Reactions';

export default function MessageWrapper({children, ...props}) {
  const {isMe, message, nextSame} = props;

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
      <View style={{maxWidth: '85%'}}>
        <Reactions message={message} isMe={isMe} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {},
});
