import {Avatar, Icon, Text, useTheme} from '@ui-kitten/components';
import React, {useState} from 'react';
import {Pressable, View} from 'react-native';
import {matrix} from '@rn-matrix/core';
import Color from 'color';

export default function SelectedAvatar({user, remove}) {
  const theme = useTheme();
  const [active, setActive] = useState(false);

  const {avatar, name, id} = user;

  const handlePress = () => {
    if (active) {
      remove(user);
    } else {
      setActive(true);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({pressed}) => ({
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginLeft: -8,
        opacity: pressed ? 0.8 : 1,
      })}>
      {active && (
        <View
          style={{
            backgroundColor: Color(theme['color-primary-default'])
              .alpha(0.5)
              .hsl()
              .string(),
            position: 'absolute',
            width: 55,
            height: 55,
            zIndex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 80,
          }}>
          <Icon name="close" style={{width: 35, height: 35}} fill="#fff" />
        </View>
      )}
      <Avatar
        style={{
          width: 55,
          height: 55,
          backgroundColor: theme['background-basic-color-2'],
          borderWidth: 3,
          borderColor: theme['background-basic-color-4'],
        }}
        source={avatar ? {uri: matrix.getHttpUrl(avatar)} : null}
      />
      {!avatar && (
        <Text
          style={{
            position: 'absolute',
            color: '#777',
          }}
          category="h5">
          {(name || id.slice(1))?.charAt(0)}
        </Text>
      )}
    </Pressable>
  );
}
