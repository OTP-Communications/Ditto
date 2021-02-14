import {Icon, useTheme} from '@ui-kitten/components';
import React from 'react';
import {Pressable, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ThemeType from '../../../../shared/themes/themeType';

export default function ScrollToBottomIndicator({onPress}) {
  const insets = useSafeAreaInsets();
  const theme: ThemeType = useTheme();
  return (
    <Pressable
    onPress={onPress}
      style={({pressed}) => ({
        position: 'absolute',
        bottom: insets.bottom + 65,
        right: 25,
        width: 45,
        height: 45,
        backgroundColor: theme[`background-basic-color-${pressed ? '4' : '3'}`],
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
      })}>
      <Icon
        name="chevron-down"
        fill={theme['color-primary-default']}
        width={35}
        height={35}
      />
    </Pressable>
  );
}
