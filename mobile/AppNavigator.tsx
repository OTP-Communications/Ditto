import {createStackNavigator} from '@react-navigation/stack';
import {matrix} from '@rn-matrix/core';
import {useObservableState} from 'observable-hooks';
import React from 'react';
import {ActivityIndicator, Pressable} from 'react-native';

// import ChatStack from './ChatStack';
// import LandingScreen from '../scenes/auth/LandingScreen';
// import LoginScreen from '../scenes/auth/LoginScreen';
import {Avatar, Layout, Text, useTheme} from '@ui-kitten/components';
// import SettingsScreen from '../scenes/settings/SettingsScreen';
// import NewChatScreen from '../scenes/newChat/NewChatScreen';
import {enableScreens} from 'react-native-screens';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import ChatListScreen from './scenes/chatList/ChatListScreen';
import LandingScreen from './scenes/auth/LandingScreen';
import LoginScreen from './scenes/auth/LoginScreen';
import ChatScreen from './scenes/chat/ChatScreen';
import SettingsScreen from './scenes/settings/SettingsScreen';

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
        <NativeStack.Screen name="Settings" component={SettingsScreen} />
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

function ChatStack({navigation}) {
  const theme = useTheme();
  const myUser = matrix.getMyUser();
  const avatar = useObservableState(myUser.avatar$);
  const name: string | undefined = useObservableState(myUser.name$);

  const navToSettings = () => {
    navigation.navigate('Settings');
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
                  backgroundColor: theme['background-basic-color-3'],
                }}
              />
              <Text style={{position: 'absolute', opacity: 0.2}} category="h6">
                {name?.charAt(0)}
              </Text>
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
        })}
      />
    </Stack.Navigator>
  );
}
