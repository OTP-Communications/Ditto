import {Icon, Layout, ListItem, Text, useTheme} from '@ui-kitten/components';
import React, {useRef} from 'react';
import {Animated, Dimensions, StyleSheet, ScrollView} from 'react-native';
import {matrix} from '@rn-matrix/core';
import {useObservableState} from 'observable-hooks';
import Spacing from '../../../shared/styles/Spacing';
import i18n from '../../../shared/i18n';
import AvatarHeader from '../../components/AvatarHeader';

export default function UserProfileScreen({navigation, route}) {
  const theme = useTheme();
  const user = route.params.user;

  const avatar: string | undefined = useObservableState(user.avatar$);
  const name: string | undefined = useObservableState(user.name$);

  const PersonIcon = (props) => <Icon {...props} name="person" />;
  const MessageIcon = (props) => (
    <Icon {...props} name="message-circle-outline" />
  );
  const BlockIcon = (props) => <Icon {...props} name="slash-outline" />;

  const HEADER_MAX_HEIGHT = Dimensions.get('screen').height / 2;

  const scrollY = useRef(new Animated.Value(0)).current;

  const openDirectChat = () => {
    const directChat = matrix.getDirectChat(user.id);
    if (directChat) {
      navigation.navigate('Chat', {
        chatId: directChat.id,
        chatName: directChat.name$.getValue(),
      });
    }
  };

  return (
    <Layout
      style={[
        styles.wrapper,
        {backgroundColor: theme['background-basic-color-5']},
      ]}>
      <Animated.ScrollView
        contentContainerStyle={{
          paddingTop: HEADER_MAX_HEIGHT,
          minHeight: Dimensions.get('screen').height + HEADER_MAX_HEIGHT,
        }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
        )}>
        <ListItem
          title={i18n.t('profile:general.message')}
          accessoryLeft={MessageIcon}
          style={{backgroundColor: theme['background-basic-color-4']}}
          onPress={openDirectChat}
        />
        <ListItem
          title={(props) => (
            <Text style={[props?.style, {color: 'red'}]}>
              {i18n.t('profile:general.block')}
            </Text>
          )}
          accessoryLeft={BlockIcon}
          style={{backgroundColor: theme['background-basic-color-4']}}
        />
        <Text
          category="h6"
          style={{
            alignSelf: 'flex-start',
            marginLeft: Spacing.l,
            marginBottom: Spacing.m,
            marginTop: Spacing.xxl,
          }}>
          {i18n.t('profile:header.linkedContact')}
        </Text>
        <ListItem
          title={i18n.t('profile:contact.linkToContact')}
          accessoryLeft={PersonIcon}
          style={{
            backgroundColor: theme['background-basic-color-4'],
            paddingVertical: 12,
          }}
        />
      </Animated.ScrollView>
      <AvatarHeader
        name={name}
        description={user.id}
        avatar={avatar && {uri: matrix.getHttpUrl(avatar)}}
        scrollY={scrollY}
        maxHeaderSize={HEADER_MAX_HEIGHT}
        onBackPress={() => navigation.goBack()}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 12,
  },
});
