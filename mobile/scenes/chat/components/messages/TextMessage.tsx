import {Text, useTheme} from '@ui-kitten/components';
import React, {useContext} from 'react';
import {View, Pressable, StyleSheet} from 'react-native';
import MessageWrapper from '../MessageWrapper';
import {matrix} from '@rn-matrix/core';
import {useObservableState} from 'observable-hooks';
import Html from '../Html';
import {getNameColor, isIos} from '../../../../../shared/utilities/misc';
import {isEmoji} from '../../../../../shared/utilities/emoji';
import Color from 'color';
import {ThemeContext} from '../../../../../shared/themes/ThemeProvider';

export default function TextMessage(props) {
  const {
    message,
    prevSame,
    nextSame,
    isMe,
    onPress = () => {},
    onLongPress = () => {},
  } = props;

  const theme = useTheme();
  const {themeId} = useContext(ThemeContext);

  const content = useObservableState(message.content$);
  const senderName = useObservableState(message.sender.name$);
  const status = useObservableState(message.status$);

  if (!content) return null;

  const bubbleBackground = (pressed) => {
    if (isMe) {
      return pressed ? theme['color-primary-600'] : theme['color-primary-500'];
    } else {
      return pressed
        ? Color(theme['background-basic-color-3']).darken(0.2).hex()
        : theme['background-basic-color-3'];
    }
  };

  return (
    <MessageWrapper {...props}>
      {isEmoji(content?.text) ? (
        <Pressable
          onPress={onPress}
          onLongPress={onLongPress}
          delayLongPress={200}
          style={({pressed}) => ({opacity: pressed ? 0.5 : 1})}>
          <Emoji
            style={!isIos() ? {fontFamily: 'NotoColorEmoji'} : {}}
            isMe={isMe}
            {...props}>
            {content.text}
          </Emoji>
        </Pressable>
      ) : (
        <Pressable
          onPress={onPress}
          onLongPress={onLongPress}
          delayLongPress={200}
          style={({pressed}) => [
            styles.bubble,
            {backgroundColor: bubbleBackground(pressed)},
            prevSame && isMe ? {borderTopRightRadius: 6} : {},
            prevSame && !isMe ? {borderTopLeftRadius: 6} : {},
            nextSame && isMe ? {borderBottomRightRadius: 6} : {},
            nextSame && !isMe ? {borderBottomLeftRadius: 6} : {},
          ]}>
          {!isMe && !prevSame && (
            <Text
              style={{
                fontWeight: 'bold',
                marginBottom: 3,
                color: getNameColor(message.sender.id, themeId),
              }}>
              {senderName}
            </Text>
          )}
          <Html html={content.html} isMe={isMe} />
        </Pressable>
      )}
    </MessageWrapper>
  );
}

const Emoji = ({style, isMe, children}) => (
  <Text
    style={{
      ...style,
      fontSize: 45,
    }}>
    {children}
  </Text>
);

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
