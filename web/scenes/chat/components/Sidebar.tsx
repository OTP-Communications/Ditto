import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {matrix} from '@rn-matrix/core';
import {useObservableState} from 'observable-hooks';
import RoomListItem from './RoomListItem';

export default function Sidebar({currentRoom, setCurrentRoom}) {
  const inviteList = useObservableState(matrix.getRoomsByType$('invites'));
  const chatList: any[] | undefined = useObservableState(matrix.getRooms$());
  const isReady = useObservableState(matrix.isReady$());
  const isSynced = useObservableState(matrix.isSynced$());

  const onRowPress = (room) => {
    setCurrentRoom(room);
  };

  const renderItem = ({item}) => {
    return (
      <RoomListItem
        key={item.id}
        room={item}
        onPress={onRowPress}
        selected={currentRoom?.id === item.id}
      />
    );
  };

  useEffect(() => {
    if (!currentRoom && chatList && chatList?.length > 0) {
      setCurrentRoom(chatList[0]);
    }
  }, [currentRoom, chatList]);

  // const InviteList = () => (
  //   <>
  //     {inviteList.map((item) =>
  //       renderInvite ? renderInvite({ item }) : renderInviteRow({ item })
  //     )}
  //   </>
  // );

  if (!isReady || !isSynced) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const InviteList = null;

  return (
    <View style={styles.wrapper}>
      <FlatList
        style={{marginTop: 3}}
        data={chatList}
        extraData={currentRoom}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={InviteList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: 'black',
  },
});
