import {Icon, Input, Layout, Text, useTheme} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import {matrix} from '@rn-matrix/core';
import {FlatList, Pressable, View} from 'react-native';
import UserListItem from './components/UserListItem';
import SelectedList from './components/SelectedList';
import Spacing from '../../../shared/styles/Spacing';

export default function NewChatScreen({navigation}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isCreating, setIsCreating] = useState(true);

  const createChat = async () => {
    setIsCreating(true);
    if (selectedUsers.length === 1) {
      const directChat = matrix.getDirectChat(selectedUsers[0].id);
      if (directChat) {
        navigation.navigate('Chat', {
          chatId: directChat.id,
          chatName: directChat.name$.getValue(),
        });
        return;
      }
    }
    const userIds: string[] = [];
    selectedUsers.forEach((u) => userIds.push(u.id));
    const chat = await matrix.createRoom({invite: userIds});
    navigation.navigate('Chat', {chatId: chat.id, chatName: chat.name});
  };

  const selectUser = (user) => {
    const userIndex = selectedUsers.findIndex((u) => u.id === user.id);
    if (userIndex >= 0) {
      // found
      const newUsers = [...selectedUsers];
      newUsers.push(user);
      setSelectedUsers(newUsers);
    } else {
      // not selected
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const removeSelected = (user) => {
    const index = selectedUsers.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      const newUsers = [...selectedUsers];
      newUsers.splice(index, 1);
      setSelectedUsers(newUsers);
    }
  };

  const renderItem = ({item}) => {
    return <UserListItem item={item} onPress={selectUser} />;
  };

  const inputIcon = (props) => <Icon {...props} name="search" />;

  useEffect(() => {
    if (searchTerm === '') {
      // We need to transform the users to simple objects because the
      // prototype is lost between components
      const knownUsers = matrix.getKnownUsers();
      setUsers(knownUsers);
    } else {
      const searchUsers = async () => {
        const userList = await matrix.searchUsers(searchTerm);
        setUsers(userList);
      };
      searchUsers();
    }
  }, [searchTerm]);

  return (
    <Layout level="4" style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Pressable
          onPress={navigation.goBack}
          style={({pressed}) => ({
            opacity: pressed ? 0.4 : 1,
            padding: 18,
            alignSelf: 'flex-end',
          })}>
          <Text category="s1" style={{fontSize: 18}}>
            Cancel
          </Text>
        </Pressable>
        <Text category="s1" style={{fontSize: 18}}>
          New Chat
        </Text>
        <Pressable
          disabled={selectedUsers.length === 0}
          onPress={createChat}
          style={({pressed}) => ({
            opacity: pressed ? 0.4 : 1,
            padding: 18,
            alignSelf: 'flex-end',
          })}>
          <Text
            category="s1"
            status={selectedUsers.length > 0 ? 'primary' : ''}
            style={{fontSize: 18}}>
            Create
          </Text>
        </Pressable>
      </View>
      <Input
        placeholder="Search"
        value={searchTerm}
        onChangeText={setSearchTerm}
        accessoryLeft={inputIcon}
        selectTextOnFocus
        clearButtonMode="while-editing"
        textStyle={{padding: Spacing.s, fontSize: 18}}
        style={{borderRadius: 12, margin: Spacing.m}}
      />
      {selectedUsers?.length > 0 && (
        <SelectedList
          selectedUsers={selectedUsers}
          removeSelected={removeSelected}
        />
      )}

      <FlatList
        data={users.filter(
          (u) => selectedUsers.findIndex((s) => s.id === u.id) < 0,
        )}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        style={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled"
      />
    </Layout>
  );
}
