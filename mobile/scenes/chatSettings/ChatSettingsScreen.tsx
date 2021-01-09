import {Avatar, Layout, List, Text, useTheme} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import ThemeType from '../../../shared/themes/themeType';
import {matrix} from '@rn-matrix/core';
import {useObservableState} from 'observable-hooks';
import Spacing from '../../../shared/styles/Spacing';
import MemberListItem from './components/MemberListItem';

export default function ChatSettingsScreen({route, navigation}) {
  const theme: ThemeType = useTheme();
  const chat = matrix.getRoomById(route?.params?.chatId);
  const name = useObservableState(chat.name$);
  const avatar = useObservableState(chat.avatar$);

  const [members, setMembers] = useState([]);

  const renderMemberListItem = ({item}) => {
    return <MemberListItem item={item} />;
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
      <Pressable
        onPress={navigation.goBack}
        style={({pressed}) => ({
          opacity: pressed ? 0.4 : 1,
          alignSelf: 'flex-end',
          padding: Spacing.l,
          paddingTop: Spacing.s,
        })}>
        <Text category="s1" style={{fontSize: 18}}>
          Done
        </Text>
      </Pressable>
      <ScrollView>
        <View
          style={{
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: Spacing.l,
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
        <List
          data={members}
          renderItem={renderMemberListItem}
          scrollEnabled={false}
          style={{alignSelf: 'stretch'}}
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
