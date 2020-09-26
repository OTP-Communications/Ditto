import {Input, List, Text, useTheme} from '@ui-kitten/components';
import {useObservableState} from 'observable-hooks';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Composer from './components/Composer';
import MessageItem from './components/MessageItem';

export default function ChatScreen({navigation, route}) {
  const chat = route.params?.chat;
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
        chat={chat}
        messageId={item}
        prevMessageId={messageList[index + 1] ? messageList[index + 1] : null}
        nextMessageId={messageList[index - 1] ? messageList[index - 1] : null}
      />
    );
  };

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
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme['background-basic-color-5'],
      }}>
      <List
        inverted
        data={timeline}
        renderItem={renderMessageItem}
        onEndReached={handleEndReached}
        style={{
          marginTop: -insets.top,
          marginHorizontal: 6,
          backgroundColor: theme['background-basic-color-5'],
        }}
      />
      <Composer chat={chat} />
    </SafeAreaView>
  );
}
