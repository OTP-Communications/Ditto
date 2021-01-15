import {Avatar, Icon, ListItem, Text, useTheme} from '@ui-kitten/components';
import {useObservableState} from 'observable-hooks';
import React from 'react';
import {View} from 'react-native';
import {matrix} from '@rn-matrix/core';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import Spacing from '../../../../shared/styles/Spacing';
import ThemeType from '../../../../shared/themes/themeType';

export default function ChatListItem({chat}) {
  const theme: ThemeType = useTheme();

  const name: string | undefined = useObservableState(chat.name$);
  const snippet: string | undefined = useObservableState(chat.snippet$);
  const avatar = useObservableState(chat.avatar$);
  const readState = useObservableState(chat.readState$);

  console.log({chat});

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
        style={{
          marginHorizontal: 8,
          width: 60,
          height: 60,
          backgroundColor: theme['background-basic-color-3'],
          borderWidth: 2,
          borderColor:
            readState === 'unread'
              ? theme['color-primary-default']
              : 'transparent',
        }}
        source={avatar ? {uri: matrix.getHttpUrl(avatar)} : null}
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
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
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
      {readState === 'unread' ? (
        <View
          style={{
            backgroundColor: theme['color-primary-default'],
            width: 16,
            height: 16,
            borderRadius: 80,
            marginRight: Spacing.s,
            marginTop: Spacing.s,
          }}
        />
      ) : readState === 'readByAll' ? (
        <Icon
          name="done-all"
          width={20}
          height={20}
          fill={theme['color-info-700']}
          style={{marginRight: Spacing.s}}
        />
      ) : (
        <Icon
          name="checkmark"
          width={20}
          height={20}
          fill={theme['color-info-700']}
          style={{marginRight: Spacing.s}}
        />
      )}
    </View>
  );

  const openChat = () => {
    navigation.navigate('Chat', {
      chatId: chat.id,
      chatName: chat.name$.getValue(),
      chatAvatar: chat.avatar$.getValue(),
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
