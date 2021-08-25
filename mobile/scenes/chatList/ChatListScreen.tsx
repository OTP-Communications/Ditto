import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import {matrix} from '@rn-matrix/core';
import {useObservableState} from 'observable-hooks';
import ChatListItem from './components/ChatListItem';
import {List, useTheme} from '@ui-kitten/components';
import InviteListItem from './components/InviteListItem';

import '../../services/notifications';

export default function ChatListScreen() {
  const theme = useTheme();

  const chatList = useObservableState(matrix.getRooms$(true));
  const inviteList = useObservableState(matrix.getRoomsByType$('invites'));
  const isReady = useObservableState(matrix.isReady$());
  const isSynced = useObservableState(matrix.isSynced$());

  const renderChatItem = ({item}) => <ChatListItem key={item.id} chat={item} />;

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

  const keyExtractor = (item) => item.id;

  return (
    <View>
      <List
        data={chatList}
        renderItem={renderChatItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={InviteList}
        ListFooterComponent={<View style={{height: 80}} />}
        style={{
          backgroundColor: theme['background-basic-color-5'],
          paddingTop: 12,
        }}
        inset
      />
    </View>
  );
}
