import {useTheme} from '@ui-kitten/components';
import {useObservableState} from 'observable-hooks';
import React from 'react';
import {Pressable, Image} from 'react-native';
import MessageWrapper from '../MessageWrapper';

export default function ImageMessage(props) {
  const {
    message,
    prevSame,
    nextSame,
    isMe,
    onPress = () => {},
    onLongPress = () => {},
  } = props;

  const theme = useTheme();
  const content = useObservableState(message.content$);

  if (!content) return null;

  const sharpRadius = 6;
  const imageStyles = {
    width: content.thumb.width,
    height: content.thumb.height,
    backgroundColor: theme['background-basic-color-3'],
    borderRadius: 20,
    ...(prevSame && isMe ? {borderTopRightRadius: sharpRadius} : {}),
    ...(prevSame && !isMe ? {borderTopLeftRadius: sharpRadius} : {}),
    ...(nextSame && isMe ? {borderBottomRightRadius: sharpRadius} : {}),
    ...(nextSame && !isMe ? {borderBottomLeftRadius: sharpRadius} : {}),
  };

  return (
    <MessageWrapper {...props}>
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        style={({pressed}) => ({opacity: pressed ? 0.5 : 1})}>
        <Image source={{uri: content.thumb.url}} style={imageStyles} />
      </Pressable>
    </MessageWrapper>
  );
}
