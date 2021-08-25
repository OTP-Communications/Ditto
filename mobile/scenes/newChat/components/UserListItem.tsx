import {Avatar, ListItem, Text, useTheme} from '@ui-kitten/components';
import React from 'react';
import {View} from 'react-native';
import {matrix} from '@rn-matrix/core';

export default function UserListItem({item, onPress = undefined}) {
  const theme = useTheme();

  const {name, id, avatar} = item;

  const UserAvatar = (props) => (
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

  const UserTitle = (props) => (
    <Text {...props} style={[props.style, {fontSize: 18}]}>
      {name}
    </Text>
  );

  const UserDescription = (props) => (
    <Text
      {...props}
      style={[
        props.style,
        {
          fontSize: 14,
          marginTop: 3,
        },
      ]}
      numberOfLines={1}>
      {id}
    </Text>
  );

  const select = () => {
    if (onPress) {
      onPress(item);
    }
  };

  return (
    <ListItem
      title={UserTitle}
      description={UserDescription}
      accessoryLeft={UserAvatar}
      // accessoryRight={renderItemAccessory}
      style={{
        width: '100%',
        backgroundColor: theme['background-basic-color-4'],
        paddingVertical: 12,
      }}
      onPress={select}
      disabled={!onPress}
      activeOpacity={0.4}
    />
  );
}
