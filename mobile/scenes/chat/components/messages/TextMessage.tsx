import {Text, useTheme} from '@ui-kitten/components';
import React from 'react';
import {View, Pressable, StyleSheet} from 'react-native';
import MessageWrapper from '../MessageWrapper';
import {matrix} from '@rn-matrix/core';
import {useObservableState} from 'observable-hooks';
import Html from '../Html';
import {getNameColor} from '../../../../../shared/utilities/misc';

export default function TextMessage(props) {
  const {message, prevSame, nextSame, onPress = () => {}} = props;

  const theme = useTheme();

  const myUser = matrix.getMyUser();
  const content = useObservableState(message.content$);
  const senderName = useObservableState(message.sender.name$);
  const status = useObservableState(message.status$);
  const reactions = useObservableState(message.reactions$);
  const isMe = myUser?.id === message.sender.id;

  if (!content) return null;

  const bubbleBackground = (pressed) => {
    if (isMe) {
      return pressed ? theme['color-primary-700'] : theme['color-primary-600'];
    } else {
      return pressed ? theme['color-basic-1000'] : theme['color-basic-900'];
    }
  };

  return (
    <MessageWrapper {...props} isMe={isMe}>
      <Pressable
        onPress={onPress}
        style={({pressed}) => [
          styles.bubble,
          {backgroundColor: bubbleBackground(pressed)},
        ]}>
        {!isMe && (
          <Text
            style={[styles.sender, {color: getNameColor(message.sender.id)}]}>
            {senderName}
          </Text>
        )}
        <Html html={content?.html} isMe={isMe} />
      </Pressable>
    </MessageWrapper>
  );
}

const styles = StyleSheet.create({
  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  sender: {
    fontWeight: 'bold',
    marginBottom: 3,
  },
});