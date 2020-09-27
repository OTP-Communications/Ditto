import {Text, useTheme} from '@ui-kitten/components';
import {useObservableState} from 'observable-hooks';
import React, {useContext} from 'react';
import {Pressable, Image} from 'react-native';
import MessageWrapper from '../MessageWrapper';
import {getNameColor} from '../../../../../shared/utilities/misc';
import {ThemeContext} from '../../../../../shared/themes/ThemeProvider';

export default function ImageMessage(props) {
  const {message, prevSame, nextSame, isMe, onPress = () => {}} = props;

  const theme = useTheme();
  const {themeId} = useContext(ThemeContext);
  const content = useObservableState(message.content$);
  const senderName = useObservableState(message.sender.name$);

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
        style={({pressed}) => ({opacity: pressed ? 0.5 : 1})}>
        <Image source={{uri: content.thumb.url}} style={imageStyles} />
      </Pressable>
    </MessageWrapper>
  );
}
