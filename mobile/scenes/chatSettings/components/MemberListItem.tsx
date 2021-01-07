import {Avatar, ListItem, Text, useTheme} from '@ui-kitten/components';
import {useObservableState} from 'observable-hooks';
import React from 'react';
import {View} from 'react-native';
import {matrix} from '@rn-matrix/core';
import ThemeType from '../../../../shared/themes/themeType';

export default function MemberListItem({item}) {
  const theme: ThemeType = useTheme();
  const user = matrix.getUserById(item.userId);
  const name = useObservableState(user.name$);
  const avatar = useObservableState(user.avatar$);

  const MemberAvatar = (props) => (
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
            width: 40,
            height: 40,
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

  return (
    <ListItem
      title={name}
      description={user.id}
      accessoryLeft={MemberAvatar}
      style={{
        backgroundColor: theme['background-basic-color-4'],
        paddingVertical: 12,
      }}
    />
  );
}
