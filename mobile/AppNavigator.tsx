import {createStackNavigator} from '@react-navigation/stack';
import {matrix} from '@rn-matrix/core';
import {useObservableState} from 'observable-hooks';
import React from 'react';
import {ActivityIndicator} from 'react-native';

// import ChatStack from './ChatStack';
// import LandingScreen from '../scenes/auth/LandingScreen';
// import LoginScreen from '../scenes/auth/LoginScreen';
import {Layout, useTheme} from '@ui-kitten/components';
// import SettingsScreen from '../scenes/settings/SettingsScreen';
// import NewChatScreen from '../scenes/newChat/NewChatScreen';
import {enableScreens} from 'react-native-screens';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import ChatListScreen from './scenes/chatList/ChatListScreen';
import LandingScreen from './scenes/auth/LandingScreen';
import LoginScreen from './scenes/auth/LoginScreen';
import ChatScreen from './scenes/chat/ChatScreen';

enableScreens();

// const debug = require('debug')('ditto:services:navigation:RootNavigator')

const NativeStack = createNativeStackNavigator();
const Stack = createStackNavigator();

export default function AppNavigator() {
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
        <ActivityIndicator size="large" color="#fff" />
      </Layout>
    );
  } else if (authLoggedIn) {
    return (
      <NativeStack.Navigator
        screenOptions={{headerShown: false, stackPresentation: 'modal'}}>
        <NativeStack.Screen name="ChatStack" component={ChatStack} />
        {/* <NativeStack.Screen name="Settings" component={SettingsScreen} />
        <NativeStack.Screen
          name="NewChat"
          component={NewChatScreen}
        /> */}
      </NativeStack.Navigator>
    );
  } else {
    return (
      <NativeStack.Navigator headerMode="none">
        <NativeStack.Screen name="Landing" component={LandingScreen} />
        <NativeStack.Screen name="Login" component={LoginScreen} />
      </NativeStack.Navigator>
    );
  }
}

/***********************************************
 * STACKS
 ***********************************************/

function ChatStack() {
  const theme = useTheme();

  return (
    <Stack.Navigator headerMode="screen">
      <Stack.Screen
        name="ChatList"
        options={{
          title: 'Chats',
          headerStyle: {backgroundColor: theme['background-basic-color-4']},
        }}
        component={ChatListScreen}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({route}) => ({
          title: route.params?.chat.name$.getValue() || 'Chat',
          headerStyle: {backgroundColor: theme['background-basic-color-4']},
        })}
      />
    </Stack.Navigator>
  );
}
