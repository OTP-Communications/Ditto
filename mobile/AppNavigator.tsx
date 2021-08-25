import {createStackNavigator} from '@react-navigation/stack';
import {matrix} from '@rn-matrix/core';
import {useObservableState} from 'observable-hooks';
import React, {useEffect} from 'react';
import {ActivityIndicator, Platform, Pressable, View} from 'react-native';

import {
  Avatar,
  Button,
  Icon,
  Layout,
  Text,
  useTheme,
} from '@ui-kitten/components';
import {enableScreens} from 'react-native-screens';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import ChatListScreen from './scenes/chatList/ChatListScreen';
import LandingScreen from './scenes/auth/LandingScreen';
import LoginScreen from './scenes/auth/LoginScreen';
import ChatScreen from './scenes/chat/ChatScreen';
import SettingsScreen from './scenes/settings/SettingsScreen';
import LightboxScreen from './scenes/chat/LightboxScreen';
import NewChatScreen from './scenes/newChat/NewChatScreen';
import Spacing from '../shared/styles/Spacing';
import ChatSettingsScreen from './scenes/chatSettings/ChatSettingsScreen';
import LanguageSelectScreen from './scenes/settings/LanguageSelectScreen';
import ThemeType from '../shared/themes/themeType';
import {_t} from '../shared/i18n';
import EditChatScreen from './scenes/chatSettings/EditChatScreen';
import RoleEditScreen from './scenes/chatSettings/RoleEditScreen';
import RNBootSplash from 'react-native-bootsplash';
import MemberListScreen from './scenes/chatSettings/MemberListScreen';
import UserProfileScreen from './scenes/user/UserProfileScreen';

enableScreens();

// const debug = require('debug')('ditto:services:navigation:RootNavigator')

const NativeStack = createNativeStackNavigator();
const Stack = createStackNavigator();

export default function AppNavigator() {
  const theme = useTheme();

  const authLoaded = useObservableState(matrix.authIsLoaded$());
  const authLoggedIn = useObservableState(matrix.isLoggedIn$());
  const matrixReady = useObservableState(matrix.isReady$());

  console.log(
    'authLoaded ',
    authLoaded,
    ' authLoggedIn ',
    authLoggedIn,
    ' matrixReady ',
    matrixReady,
  );

  useEffect(() => {
    if (authLoaded) {
      RNBootSplash.hide({fade: true});
    }
  }, [authLoaded]);

  if (!authLoaded || (authLoggedIn && !matrixReady)) {
    return (
      <Layout
        level="3"
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color={theme['color-basic-100']} />
      </Layout>
    );
  } else if (authLoggedIn) {
    return (
      <NativeStack.Navigator
        screenOptions={{headerShown: false, stackPresentation: 'modal'}}>
        <NativeStack.Screen name="ChatStack" component={ChatStack} />
        <NativeStack.Screen name="Lightbox" component={LightboxScreen} />
        <NativeStack.Screen name="Settings" component={SettingsStack} />
        <NativeStack.Screen name="NewChat" component={NewChatScreen} />
      </NativeStack.Navigator>
    );
  } else {
    return (
      <NativeStack.Navigator screenOptions={{headerShown: false}}>
        <NativeStack.Screen name="Landing" component={LandingScreen} />
        <NativeStack.Screen name="Login" component={LoginScreen} />
      </NativeStack.Navigator>
    );
  }
}

/***********************************************
 * STACKS
 ***********************************************/

function ChatStack({navigation}) {
  const theme: ThemeType = useTheme();
  const myUser = matrix.getMyUser();
  const avatar = useObservableState(myUser?.avatar$);
  const name: string | undefined = useObservableState(myUser?.name$);

  const navToSettings = () => {
    navigation.navigate('Settings');
  };

  const navToNewChat = () => {
    navigation.navigate('NewChat');
  };

  const navToChatSettings = (chatId) => {
    navigation.navigate('ChatSettings', {chatId});
  };

  const navToEditChat = (chatId) => {
    navigation.navigate('EditChat', {chatId});
  };

  return (
    <Stack.Navigator headerMode="screen">
      <Stack.Screen
        name="ChatList"
        options={{
          title: _t('Chats'),
          headerStyle: {
            backgroundColor: theme['background-basic-color-4'],
          },
          headerLeft: () => (
            <Pressable
              onPress={navToSettings}
              style={({pressed}) => ({
                position: 'relative',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 18,
                opacity: pressed ? 0.6 : 1,
              })}>
              <Avatar
                source={avatar ? {uri: matrix.getHttpUrl(avatar)} : null}
                size="small"
                style={{
                  backgroundColor: theme['background-basic-color-2'],
                }}
              />
              {!avatar && (
                <Text
                  style={{position: 'absolute', opacity: 0.2}}
                  category="h6">
                  {name?.charAt(0)}
                </Text>
              )}
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              onPress={navToNewChat}
              style={({pressed}) => ({
                position: 'relative',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: Spacing.m,
                opacity: pressed ? 0.4 : 1,
                padding: 8,
              })}>
              <Icon
                style={{width: 28, height: 28}}
                fill={theme['color-primary-default']}
                name="edit-2-outline"
              />
            </Pressable>
          ),
        }}
        component={ChatListScreen}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({route, navigation}) => ({
          title: route.params?.chatName || 'Chat',
          headerTintColor: theme['text-basic-color'],
          headerStyle: {backgroundColor: theme['background-basic-color-4']},
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.navigate('ChatList')}
              style={({pressed}) => ({
                padding: Spacing.m,
                flexDirection: 'row',
                alignItems: 'center',
                opacity: pressed ? 0.4 : 1,
              })}>
              <Icon
                name="chevron-left"
                fill={theme['text-basic-color']}
                width={25}
                height={25}
              />
              {Platform.OS === 'ios' && (
                <Text category="s2" style={{fontSize: 18}}>
                  Chats
                </Text>
              )}
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              onPress={() => navToChatSettings(route.params?.chatId)}
              style={({pressed}) => ({
                marginRight: 18,
                opacity: pressed ? 0.6 : 1,
                padding: Spacing.m,
                paddingRight: 0,
              })}>
              <View
                style={{
                  position: 'relative',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Avatar
                  source={{
                    uri:
                      matrix.getHttpUrl(route.params?.chatAvatar).length > 0
                        ? matrix.getHttpUrl(route.params?.chatAvatar)
                        : undefined,
                  }}
                  size="small"
                  style={{
                    backgroundColor: theme['background-basic-color-2'],
                  }}
                />
                {!route.params?.chatAvatar && (
                  <Text
                    style={{position: 'absolute', opacity: 0.2}}
                    category="h6">
                    {route.params?.chatName.charAt(0)}
                  </Text>
                )}
              </View>
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="ChatSettings"
        component={ChatSettingsScreen}
        options={{
          headerTintColor: theme['color-basic-100'],
          headerStyle: {
            shadowOpacity: 0,
          },
          title: '',
          headerBackTitle: 'Back',
          // headerRight: () => (
          //   <Pressable
          //     onPress={navToEditChat}
          //     style={({pressed}) => ({
          //       opacity: pressed ? 0.4 : 1,
          //       alignSelf: 'flex-end',
          //       padding: Spacing.m,
          //       paddingRight: Spacing.l,
          //     })}>
          //     <Text category="s1" style={{fontSize: 20}}>
          //       Edit
          //     </Text>
          //   </Pressable>
          // ),
        }}
      />
      <Stack.Screen
        name="EditChat"
        component={EditChatScreen}
        options={{
          headerTintColor: theme['color-basic-100'],
          title: '',
          headerBackTitle: 'Cancel',
          headerRight: () => (
            <Pressable
              onPress={navToEditChat}
              style={({pressed}) => ({
                opacity: pressed ? 0.4 : 1,
                alignSelf: 'flex-end',
                padding: Spacing.m,
                paddingRight: Spacing.l,
              })}>
              <Text status="primary" category="s1" style={{fontSize: 20}}>
                Save
              </Text>
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="MemberList"
        component={MemberListScreen}
        options={{
          headerTintColor: theme['color-basic-100'],
          title: 'Members',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="RoleEdit"
        component={RoleEditScreen}
        options={({route}) => ({
          headerTintColor: theme['color-basic-100'],
          title: 'Roles',
          headerBackTitle: 'Cancel',
          headerRight: () => (
            <Pressable
              onPress={route?.params?.saveRoleChanges || undefined}
              style={({pressed}) => ({
                opacity: pressed ? 0.4 : 1,
                alignSelf: 'flex-end',
                padding: Spacing.m,
                paddingRight: Spacing.l,
              })}>
              <Text status="primary" category="s1" style={{fontSize: 20}}>
                Save
              </Text>
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="Profile"
        options={() => ({
          title: '',
          headerShown: false,
          headerStyle: {
            backgroundColor: 'transparent',
            borderBottomWidth: 0,
            elevation: 0,
            shadowColor: 'transparent',
          },
        })}
        component={UserProfileScreen}
      />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  const theme: ThemeType = useTheme();
  return (
    <Stack.Navigator headerMode="screen">
      <Stack.Screen
        name="Settings"
        options={({navigation}) => ({
          title: '',
          headerStyle: {
            backgroundColor: theme['background-basic-color-5'],
            borderBottomWidth: 0,
            elevation: 0,
            shadowColor: 'transparent',
          },
          headerRight: () => (
            <Pressable
              onPress={navigation.goBack}
              style={({pressed}) => ({
                opacity: pressed ? 0.4 : 1,
                alignSelf: 'flex-end',
                padding: Spacing.m,
                paddingRight: Spacing.l,
                paddingTop: Spacing.l,
              })}>
              <Text category="s1" style={{fontSize: 18}}>
                Done
              </Text>
            </Pressable>
          ),
        })}
        component={SettingsScreen}
      />
      <Stack.Screen
        name="LanguageSelect"
        options={({navigation}) => ({
          title: _t('Choose Language'),
          headerTintColor: theme['text-basic-color'],
          headerStyle: {
            backgroundColor: theme['background-basic-color-5'],
            borderBottomWidth: 0,
            elevation: 0,
            shadowColor: 'transparent',
          },
        })}
        component={LanguageSelectScreen}
      />
    </Stack.Navigator>
  );
}
