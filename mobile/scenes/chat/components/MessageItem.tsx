import {Text} from '@ui-kitten/components';
import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {matrix, Message} from '@rn-matrix/core';
import {useObservableState} from 'observable-hooks';
import TextMessage from './messages/TextMessage';
import EventMessage from './messages/EventMessage';
import ImageMessage from './messages/ImageMessage';
import Spacing from '../../../../shared/styles/Spacing';

export default function MessageItem({
  chatId,
  messageId,
  prevMessageId,
  nextMessageId,
  onPress,
  onLongPress,
  ...otherProps
}) {
  const myUser = matrix.getMyUser();
  const chat = matrix.getRoomById(chatId);
  const typing = useObservableState(chat?.typing$);

  if (messageId === 'loading') {
    return <ActivityIndicator style={{marginVertical: Spacing.xxl}} />;
  }
  if (messageId === 'typing' && typing) {
    return (
      <View style={{marginVertical: Spacing.xs, marginLeft: Spacing.l}}>
        <Text style={{fontStyle: 'italic'}} appearance="hint">
          {typing.length === 1
            ? matrix.getUserById(typing[0]).name$.getValue()
            : 'Users'}{' '}
          {typing.length === 1 ? 'is' : 'are'} typing...
        </Text>
      </View>
    );
  }

  const message = matrix.getMessageById(messageId, chatId);

  if (!message || !message.type$) return null;

  const prevMessage =
    prevMessageId && prevMessageId !== 'loading'
      ? matrix.getMessageById(prevMessageId, chatId)
      : null;
  const nextMessage =
    nextMessageId && nextMessageId !== 'typing'
      ? matrix.getMessageById(nextMessageId, chatId)
      : null;
  const prevSame = isSameSender(message, prevMessage);
  const nextSame = isSameSender(message, nextMessage);
  const isMe = myUser?.id === message.sender.id;

  const onMessagePress = () => onPress(message);
  const onMessageLongPress = () => onLongPress(message);

  const props = {
    ...otherProps,
    onPress: onMessagePress,
    onLongPress: onMessageLongPress,
    message,
    prevSame,
    nextSame,
    isMe,
  };

  const messageType = useObservableState(message.type$);

  if (message.redacted$.getValue()) {
    return null;
    return <EventMessage {...props} />;
  }

  if (Message.isTextMessage(messageType)) {
    return <TextMessage {...props} />;
  }
  if (Message.isImageMessage(messageType)) {
    return <ImageMessage {...props} />;
  }
  // if (Message.isVideoMessage(messageType) || Message.isFileMessage(messageType)) {
  //   return <FileMessage {...props} />;
  // }
  // if (Message.isNoticeMessage(messageType)) {
  //   return <NoticeMessage {...props} />;
  // }
  return <EventMessage {...props} />;
}

function isSameSender(messageA, messageB) {
  if (
    !messageA ||
    !messageB ||
    !Message.isBubbleMessage(messageA) ||
    !Message.isBubbleMessage(messageB) ||
    messageA.sender.id !== messageB.sender.id
  ) {
    return false;
  }
  return true;
}
