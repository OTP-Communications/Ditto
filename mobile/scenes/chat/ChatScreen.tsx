import {List, useTheme} from '@ui-kitten/components';
import {useObservableState} from 'observable-hooks';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Composer from './components/Composer';
import MessageItem from './components/MessageItem';
import {Message} from '@rn-matrix/core';
import {isIos} from '../../../shared/utilities/misc';
import {lightHaptic} from '../../../shared/utilities/haptic';
import ChatActionSheet from './components/ChatActionSheet';
import {Keyboard} from 'react-native';
import {matrix} from '@rn-matrix/core';
import PushNotification from 'react-native-push-notification';

export default function ChatScreen({navigation, route}) {
  const chat = matrix.getRoomById(route.params?.chatId);
  if (!chat) {
    navigation.goBack();
  }

  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const name = useObservableState(chat.name$);
  const messageList = useObservableState(chat.messages$);
  const typing = useObservableState(chat.typing$);
  const atStart = useObservableState(chat.atStart$);
  const [timeline, setTimeline] = useState(messageList);
  const [isLoading, setIsLoading] = useState(false);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [activeMessage, setActiveMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const handleEndReached = async () => {
    if (!atStart && !isLoading) {
      setIsLoading(true);
      await chat.fetchPreviousMessages();
      setIsLoading(false);
    }
  };

  const renderMessageItem = ({item, index}) => {
    return (
      <MessageItem
        key={item}
        chatId={chat.id}
        isDirectObservable={chat.isDirect$}
        messageId={item}
        message={matrix.getMessageById(item, chat.id)}
        prevMessageId={messageList[index + 1] ? messageList[index + 1] : null}
        nextMessageId={messageList[index - 1] ? messageList[index - 1] : null}
        onPress={onPress}
        onLongPress={onLongPress}
      />
    );
  };

  const onPress = (message) => {
    if (Message.isImageMessage(message.type$.getValue())) {
      navigation.navigate('Lightbox', {message});
    }
  };

  const onLongPress = (message) => {
    lightHaptic();
    Keyboard.dismiss();
    setActiveMessage(message);
    setActionSheetVisible(true);
  };

  const onAvatarPress = (user) => {
    Keyboard.dismiss();
    navigation.navigate('Profile', {user});
  };

  const keyExtractor = (item) => item;

  useEffect(() => {
    handleEndReached();
    PushNotification.setApplicationIconBadgeNumber(0);
    PushNotification.removeAllDeliveredNotifications();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: name,
    });
  }, [name]);

  useEffect(() => {
    // mark as read
    chat.sendReadReceipt();

    // We put loading and typing indicator into the Timeline to have better
    // visual effects when we swipe to top or bottom
    if (messageList) {
      const tempTimeline = [...messageList];
      if (isLoading) tempTimeline.push('loading');
      if (typing.length > 0) tempTimeline.unshift('typing');
      setTimeline(tempTimeline);
    }
  }, [isLoading, messageList, chat, typing]);

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: theme['background-basic-color-5'],
        }}>
        <List
          initialNumToRender={20}
          windowSize={20}
          inverted
          keyboardDismissMode={isIos() ? 'interactive' : 'on-drag'}
          keyboardShouldPersistTaps="handled"
          data={timeline}
          keyExtractor={keyExtractor}
          renderItem={renderMessageItem}
          onEndReached={handleEndReached}
          style={{
            marginTop: -insets.top,
            marginHorizontal: 6,
            backgroundColor: theme['background-basic-color-5'],
          }}
        />
        <Composer
          chat={chat}
          activeMessage={activeMessage}
          setActiveMessage={setActiveMessage}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          isReplying={isReplying}
          setIsReplying={setIsReplying}
        />
      </SafeAreaView>
      <ChatActionSheet
        visible={actionSheetVisible}
        setVisible={setActionSheetVisible}
        activeMessage={activeMessage}
        setActiveMessage={setActiveMessage}
        setIsEditing={setIsEditing}
        setIsReplying={setIsReplying}
      />
    </>
  );
}
