import {
  Avatar,
  Divider,
  Icon,
  Layout,
  List,
  ListItem,
  Text,
  useTheme,
} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import ThemeType from '../../../shared/themes/themeType';
import {matrix} from '@rn-matrix/core';
import {useObservableState} from 'observable-hooks';
import Spacing from '../../../shared/styles/Spacing';
import MemberListItem from './components/MemberListItem';
import i18n from '../../../shared/i18n';

export default function ChatSettingsScreen({route, navigation}) {
  const theme: ThemeType = useTheme();
  const chat = matrix.getRoomById(route?.params?.chatId);
  const name = useObservableState(chat.name$);
  const avatar = useObservableState(chat.avatar$);

  const [members, setMembers] = useState([]);
  const [currentOpen, setCurrentOpen] = useState(null); // which swipeable row is open

  const roleEvent = chat._matrixRoom.currentState.getStateEvents(
    'm.room.roles',
    '',
  );
  const currentRoles = {
    ...(roleEvent?.getPrevContent() || {}),
    ...(roleEvent?.getContent() || {}),
  };

  const renderMemberListItem = ({item}) => {
    return (
      <MemberListItem
        chat={chat}
        item={item}
        currentOpen={currentOpen}
        setCurrentOpen={setCurrentOpen}
        currentRoles={currentRoles}
      />
    );
  };

  const getMembers = async () => {
    const client = matrix.getClient();
    const room = client.getRoom(chat.id);
    await room.loadMembersIfNeeded();
    setMembers(room.getJoinedMembers());
  };

  const clearMembers = () => {
    const client = matrix.getClient();
    const room = client.getRoom(chat.id);
    room.clearLoadedMembersIfNeeded();
  };

  const navToRoleEdit = () => {
    navigation.navigate('RoleEdit', {chatId: chat.id});
  };

  useEffect(() => {
    getMembers();
    return () => {
      clearMembers();
    };
  }, []);

  return (
    <Layout
      style={[
        styles.wrapper,
        {backgroundColor: theme['background-basic-color-5']},
      ]}>
      <ScrollView>
        <View
          style={{
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: Spacing.l,
          }}>
          <Avatar
            source={avatar ? {uri: matrix.getHttpUrl(avatar)} : null}
            style={{
              width: 100,
              height: 100,
              backgroundColor: theme['background-basic-color-3'],
            }}
          />
          {!avatar && (
            <Text
              category="h1"
              style={{
                position: 'absolute',
                fontSize: 50,
                opacity: 0.3,
              }}
              numberOfLines={1}>
              {name?.charAt(0)}
            </Text>
          )}
        </View>

        <Text
          category="h4"
          style={{
            maxWidth: '80%',
            textAlign: 'center',
            alignSelf: 'center',
            marginBottom: Spacing.xxl,
          }}
          numberOfLines={2}>
          {name}
        </Text>

        <Text
          category="h6"
          style={{
            alignSelf: 'flex-start',
            marginLeft: Spacing.l,
            marginBottom: Spacing.m,
          }}>
          Security
        </Text>
        <ListItem
          onPress={navToRoleEdit}
          title={'Roles'}
          accessoryLeft={(props) => (
            <Icon {...props} fill={theme['color-info-default']} name="people" />
          )}
          accessoryRight={(props) => (
            <Icon
              {...props}
              fill={theme['color-basic-700']}
              name="chevron-right"
            />
          )}
          style={{
            backgroundColor: theme['background-basic-color-4'],
            height: 52,
          }}
        />

        <Text
          category="h6"
          style={{
            alignSelf: 'flex-start',
            marginLeft: Spacing.l,
            marginBottom: Spacing.m,
            marginTop: Spacing.xxl,
          }}>
          Members ({members.length})
        </Text>

        <List
          data={members.slice(0, 10)}
          renderItem={renderMemberListItem}
          scrollEnabled={false}
          style={{alignSelf: 'stretch'}}
          ListFooterComponent={() =>
            members.length > 9 ? (
              <ListItem
                onPress={() => {}}
                title={`View all ${members.length} members`}
                accessoryRight={(props) => (
                  <Icon name="chevron-right" {...props} />
                )}
                style={{
                  backgroundColor: theme['background-basic-color-4'],
                  zIndex: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 60,
                }}
                activeOpacity={0.4}
              />
            ) : null
          }
        />
        <View style={{height: 200}} />
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 12,
  },
});
