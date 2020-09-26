import {Text} from '@ui-kitten/components';
import {useObservableState} from 'observable-hooks';
import React, {useEffect} from 'react';
import {View} from 'react-native';

export default function ChatScreen({navigation, route}) {
  const chat = route.params?.chat;
  if (!chat) {
    navigation.goBack();
  }

  const name = useObservableState(chat.name$);

  useEffect(() => {
    navigation.setOptions({
      title: name,
    });
  }, [name]);

  return (
    <View>
      <Text>chat</Text>
    </View>
  );
}
