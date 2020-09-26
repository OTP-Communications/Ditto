import React from 'react';
import {View, Text, FlatList, ActivityIndicator} from 'react-native';
import {matrix} from '@rn-matrix/core';
import {useObservableState} from 'observable-hooks';
import ChatListItem from './components/ChatListItem';
import {List, useTheme} from '@ui-kitten/components';
import InviteListItem from './components/InviteListItem';

export default function ChatListScreen() {
  const theme = useTheme();

  const chatList = useObservableState(matrix.getRooms$());
  const inviteList = useObservableState(matrix.getRoomsByType$('invites'));
  const isReady = useObservableState(matrix.isReady$());
  const isSynced = useObservableState(matrix.isSynced$());

  const renderChatItem = ({item}) => {
    return <ChatListItem key={item.id} chat={item} />;
  };

  const InviteList = () => (
    <>
      {inviteList.map((invite) => (
        <InviteListItem key={invite.id} invite={invite} />
      ))}
    </>
  );

  if (!isReady || !isSynced) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <List
      data={chatList}
      renderItem={renderChatItem}
      ListHeaderComponent={InviteList}
    />
  );
}
