import {Avatar, ListItem, Text, useTheme} from '@ui-kitten/components';
import {useObservableState} from 'observable-hooks';
import React from 'react';
import {View} from 'react-native';
import {matrix} from '@rn-matrix/core';
import {useNavigation} from '@react-navigation/native';

export default function ChatListItem({chat}) {
  const theme = useTheme();

  const name: string | undefined = useObservableState(chat.name$);
  const snippet: string | undefined = useObservableState(chat.snippet$);
  const avatar = useObservableState(chat.avatar$);

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
            width: 50,
            height: 50,
            backgroundColor: theme['background-basic-color-3'],
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
    <Text {...props} style={[props.style, {fontSize: 18}]}>
      {name}
    </Text>
  );

  const ChatDescription = (props) => (
    <Text {...props} style={[props.style, {fontSize: 14, marginTop: 3}]}>
      {snippet?.content}
    </Text>
  );

  const openChat = () => {
    navigation.navigate('Chat', {chat});
  };

  return (
    <ListItem
      title={ChatTitle}
      description={ChatDescription}
      accessoryLeft={ChatAvatar}
      // accessoryRight={renderItemAccessory}
      style={{backgroundColor: theme['background-basic-color-5']}}
      onPress={openChat}
      activeOpacity={0.4}
    />
  );
}
