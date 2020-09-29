import {createStackNavigator} from '@react-navigation/stack';
import {matrix} from '@rn-matrix/core';
import {useObservableState} from 'observable-hooks';
import React, {useContext} from 'react';
import {ActivityIndicator, Pressable} from 'react-native';

import {Avatar, Layout, Text, useTheme} from '@ui-kitten/components';
import {enableScreens} from 'react-native-screens';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import ChatListScreen from './scenes/chatList/ChatListScreen';
import LandingScreen from './scenes/auth/LandingScreen';
import LoginScreen from './scenes/auth/LoginScreen';
import ChatScreen from './scenes/chat/ChatScreen';
import SettingsScreen from './scenes/settings/SettingsScreen';
import {ThemeContext} from '../shared/themes/ThemeProvider';
import LightboxScreen from './scenes/chat/LightboxScreen';

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
  const theme = useTheme();
  const myUser = matrix.getMyUser();
  const avatar = useObservableState(myUser?.avatar$);
  const name: string | undefined = useObservableState(myUser?.name$);

  const {themeId, setTheme} = useContext(ThemeContext);

  const navToSettings = () => {
    navigation.navigate('Settings');
  };

  const toggleTheme = () => {
    setTheme(themeId === 'light' ? 'dark' : 'light');
  };

  return (
    <Stack.Navigator headerMode="screen">
      <Stack.Screen
        name="ChatList"
        options={{
          title: 'Chats',
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
                source={{uri: matrix.getHttpUrl(avatar)}}
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
        }}
        component={ChatListScreen}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({route}) => ({
          title: route.params?.chat.name$.getValue() || 'Chat',
          headerStyle: {backgroundColor: theme['background-basic-color-4']},
          //   headerRight: () => (
          //     <Pressable
          //       onPress={toggleTheme}
          //       style={({pressed}) => ({
          //         position: 'relative',
          //         justifyContent: 'center',
          //         alignItems: 'center',
          //         marginRight: 18,
          //         opacity: pressed ? 0.6 : 1,
          //       })}>
          //       <Avatar
          //         source={{
          //           uri: matrix.getHttpUrl(route.params?.chat.avatar$.getValue()),
          //         }}
          //         size="small"
          //         style={{
          //           backgroundColor: theme['background-basic-color-2'],
          //         }}
          //       />
          //       {!route.params?.chat.avatar$.getValue() && (
          //         <Text
          //           style={{position: 'absolute', opacity: 0.2}}
          //           category="h6">
          //           {route.params?.chat.name$.getValue()?.charAt(0)}
          //         </Text>
          //       )}
          //     </Pressable>
          //   ),
        })}
      />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  const theme = useTheme();
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
                marginRight: 18,
                opacity: pressed ? 0.4 : 1,
              })}>
              <Text category="s1" style={{fontSize: 18}}>
                Done
              </Text>
            </Pressable>
          ),
        })}
        component={SettingsScreen}
      />
    </Stack.Navigator>
  );
}
