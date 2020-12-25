import {Avatar, ListItem, Text, useTheme} from '@ui-kitten/components';
import {useObservableState} from 'observable-hooks';
import React from 'react';
import {View} from 'react-native';
import {matrix} from '@rn-matrix/core';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';

export default function ChatListItem({chat}) {
  const theme = useTheme();

  const name: string | undefined = useObservableState(chat.name$);
  const snippet: string | undefined = useObservableState(chat.snippet$);
  const avatar = useObservableState(chat.avatar$);
  const readState = useObservableState(chat.readState$);

  const navigation = useNavigation();

  const ChatAvatar = (props) => (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}>
      <Avatar
        {...props}
        style={[
          props.style,
          {
            tintColor: null,
            width: 60,
            height: 60,
            backgroundColor: theme['background-basic-color-3'],
            borderWidth: 2,
            borderColor:
              readState === 'unread'
                ? theme['color-primary-default']
                : 'transparent',
          },
        ]}
        source={{uri: matrix.getHttpUrl(avatar)}}
      />
      {!avatar && (
        <Text
          style={{
            position: 'absolute',
            color: theme['background-basic-color-1'],
          }}
          category="h5">
          {name?.charAt(0)}
        </Text>
      )}
    </View>
  );

  const ChatTitle = (props) => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <Text
        {...props}
        style={[
          props.style,
          {fontSize: 18, fontWeight: readState === 'unread' ? '800' : '400'},
        ]}>
        {name}
      </Text>
      <Text
        {...props}
        style={[props.style, {opacity: 0.4, fontSize: 14, fontWeight: '400'}]}>
        {moment(snippet?.timestamp).fromNow()}
      </Text>
    </View>
  );

  const ChatDescription = (props) => (
    <Text
      {...props}
      style={[
        props.style,
        {
          fontSize: 14,
          marginTop: 3,
          fontWeight: readState === 'unread' ? '700' : '400',
        },
      ]}
      numberOfLines={2}>
      {snippet?.content?.trim()}
    </Text>
  );

  const openChat = () => {
    navigation.navigate('Chat', {
      chatId: chat.id,
      chatName: chat.name$.getValue(),
    });
  };

  return (
    <ListItem
      title={ChatTitle}
      description={ChatDescription}
      accessoryLeft={ChatAvatar}
      // accessoryRight={renderItemAccessory}
      style={{
        width: '100%',
        backgroundColor: theme['background-basic-color-5'],
        paddingVertical: 12,
      }}
      onPress={openChat}
      activeOpacity={0.4}
    />
  );
}
