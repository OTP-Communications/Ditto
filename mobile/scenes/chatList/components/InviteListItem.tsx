import {
  Avatar,
  Icon,
  Layout,
  ListItem,
  Text,
  Button,
  useTheme,
} from '@ui-kitten/components';
import {useObservableState} from 'observable-hooks';
import React from 'react';
import {View} from 'react-native';
import {matrix} from '@rn-matrix/core';

export default function InviteListItem({invite}) {
  const theme = useTheme();

  const name: string | undefined = useObservableState(invite.name$);
  const avatar = useObservableState(invite.avatar$);

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
          borderColor: theme['color-primary-default'],
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
    <Text {...props} style={[props.style, {fontSize: 18, fontWeight: '800'}]}>
      {name}
    </Text>
  );

  const AcceptIcon = (props) => (
    <Icon
      {...props}
      style={[props.style, {width: 30, height: 30}]}
      name="checkmark-outline"
    />
  );

  const RejectIcon = (props) => (
    <Icon
      {...props}
      style={[props.style, {width: 30, height: 30}]}
      name="close-outline"
    />
  );

  const ResponseButtons = (props) => (
    <Layout
      {...props}
      style={{
        backgroundColor: theme['color-basic-1100'],
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Button
        style={{marginRight: 12, borderRadius: 80, width: 45, height: 45}}
        status="success"
        accessoryLeft={AcceptIcon}
        onPress={joinWithInvite}
      />
      <Button
        style={{marginRight: 6, borderRadius: 80, width: 45, height: 45}}
        status="danger"
        accessoryLeft={RejectIcon}
        onPress={rejectInvite}
      />
    </Layout>
  );

  const joinWithInvite = () => {
    matrix.joinRoom(invite.id);
  };

  const rejectInvite = () => {
    matrix.leaveRoom(invite.id);
  };

  return (
    <ListItem
      title={ChatTitle}
      accessoryLeft={ChatAvatar}
      accessoryRight={ResponseButtons}
      style={{backgroundColor: theme['color-basic-1100']}}
    />
  );
}
