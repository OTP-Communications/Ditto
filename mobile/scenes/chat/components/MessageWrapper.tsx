import {Avatar, Text, useTheme} from '@ui-kitten/components';
import {useObservableState} from 'observable-hooks';
import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {ThemeContext} from '../../../../shared/themes/ThemeProvider';
import Reactions from './Reactions';
import {getNameColor} from '../../../../shared/utilities/misc';
import {isEmoji} from '../../../../shared/utilities/emoji';
import {matrix, Message} from '@rn-matrix/core';

export default function MessageWrapper({children, ...props}) {
  const {isMe, message, nextSame, prevSame, chat} = props;

  const theme = useTheme();
  const {themeId} = useContext(ThemeContext);

  const type = useObservableState(message.type$);
  const senderName = useObservableState(message.sender.name$);
  const senderAvatar = useObservableState(message.sender.avatar$);
  const content = useObservableState(message.content$);
  const isDirect = useObservableState(chat.isDirect$);

  const showSenderName =
    !isMe &&
    !prevSame &&
    (!Message.isTextMessage(type) || isEmoji(content?.text));

  const showAvatar = !isDirect && !isMe && !nextSame;

  return (
    <View
      style={[
        styles.wrapper,
        {
          alignItems: isMe ? 'flex-end' : 'flex-start',
          marginBottom: nextSame ? 3 : 12,
        },
      ]}>
      <View
        style={{maxWidth: '85%', flexDirection: 'row', alignItems: 'flex-end'}}>
        <Avatar
          size="small"
          source={{uri: showAvatar ? matrix.getHttpUrl(senderAvatar) : ''}}
          style={{
            backgroundColor: showAvatar
              ? theme['background-basic-color-3']
              : 'transparent',
            marginRight: 8,
            marginBottom: 3,
          }}
        />
        <View style={{maxWidth: '85%'}}>
          {showSenderName && (
            <Text
              style={{
                fontWeight: 'bold',
                marginBottom: 3,
                marginLeft: 18,
                color: getNameColor(message.sender.id, themeId),
              }}>
              {senderName}
            </Text>
          )}
          {children}
        </View>
      </View>
      <View
        style={{
          maxWidth: '85%',
          marginLeft: !isMe && !isDirect ? 36 : 0,
        }}>
        <Reactions message={message} isMe={isMe} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {},
});
