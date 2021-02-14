import {Avatar, ListItem, Text, useTheme} from '@ui-kitten/components';
import React from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import Spacing from '../../shared/styles/Spacing';
import {HeaderBackButton} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ThemeType from '../../shared/themes/themeType';
type AvatarHeaderProps = {
  name?: string;
  description?: string;
  avatar?: Object;
  scrollY: Animated.Value;
  maxHeaderSize?: number;
  onBackPress?: Function;
};

export default function AvatarHeader({
  name,
  description,
  avatar,
  scrollY,
  maxHeaderSize,
  onBackPress,
}: AvatarHeaderProps) {
  const theme: ThemeType = useTheme();
  const insets = useSafeAreaInsets();

  const HEADER_MAX_HEIGHT = maxHeaderSize
    ? maxHeaderSize
    : Dimensions.get('screen').height / 2;
  const HEADER_MIN_HEIGHT = Platform.select({ios: 58, default: 74});
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: 'clamp',
  });

  const userItemOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  });

  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 100],
    extrapolate: 'clamp',
  });

  const styles = StyleSheet.create({
    stickyTop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
    },
    headerAndroid: {
      backgroundColor: 'transparent',
    },
    headerIOS: {
      backgroundColor: 'transparent',
      marginLeft: -36,
    },
    headerTextAvatar: {
      position: 'absolute',
      fontSize: 25,
      opacity: 0.3,
    },
    headerAvatar: {
      width: 50,
      height: 50,
      backgroundColor: theme['background-basic-color-3'],
    },
  });

  const Header = () =>
    Platform.select({
      ios: (
        <ListItem
          style={styles.headerIOS}
          title={(props) => (
            <Text style={[props?.style, {textAlign: 'center'}]}>{name}</Text>
          )}
          description={(props) => (
            <Text
              style={[props?.style, {color: 'lightgrey', textAlign: 'center'}]}>
              {description}
            </Text>
          )}
        />
      ),
      default: (
        <ListItem
          title={name}
          description={description}
          style={styles.headerAndroid}
          accessoryLeft={() => (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Avatar source={avatar} style={styles.headerAvatar} />
              {!avatar && (
                <Text
                  category="h1"
                  style={styles.headerTextAvatar}
                  numberOfLines={1}>
                  {name?.charAt(0)}
                </Text>
              )}
            </View>
          )}
        />
      ),
    });

  return (
    <View
      style={[
        styles.stickyTop,
        {
          alignContent: 'center',
        },
      ]}>
      <Animated.View
        style={[
          styles.stickyTop,
          {
            backgroundColor: theme['background-basic-color-5'],
            overflow: 'hidden',
            height: HEADER_MAX_HEIGHT,
            transform: [{translateY: headerTranslateY}],
          },
        ]}>
        <Animated.View
          style={[
            styles.stickyTop,
            {
              height: HEADER_MAX_HEIGHT,
              opacity: imageOpacity,
              transform: [{translateY: imageTranslateY}],
            },
          ]}>
          <Animated.Image
            style={{
              width: null,
              height: HEADER_MAX_HEIGHT,
              resizeMode: 'cover',
            }}
            source={avatar}
          />
          <Animated.View
            style={{
              position: 'absolute',
              left: 32,
              bottom: 0,
              opacity: imageOpacity,
              paddingBottom: Spacing.m,
            }}>
            <Text category="h4" style={{maxWidth: 250}} numberOfLines={1}>
              {name}
            </Text>
            <Text
              category="h6"
              style={{color: 'lightgrey', maxWidth: 250}}
              numberOfLines={1}>
              {description}
            </Text>
          </Animated.View>
        </Animated.View>
      </Animated.View>
      <View
        style={{
          flexDirection: 'row',
          paddingTop: insets.top,
        }}>
        <HeaderBackButton
          tintColor={theme['text-basic-color']}
          onPress={onBackPress}
        />
        <Animated.View
          style={{
            opacity: userItemOpacity,
            flexGrow: 1,
          }}>
          <Header />
        </Animated.View>
      </View>
    </View>
  );
}
