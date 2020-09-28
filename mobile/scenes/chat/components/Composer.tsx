import {Button, Icon, Input, Text, useTheme} from '@ui-kitten/components';
import React, {useEffect, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useHeaderHeight} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {matrix} from '@rn-matrix/core';
import {TextInput} from 'react-native-gesture-handler';

export default function Composer({
  chat,
  activeMessage,
  setActiveMessage,
  isEditing,
  setIsEditing,
}) {
  const theme = useTheme();
  const {t} = useTranslation('messages');
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const [isFocused, setIsFocused] = useState(false);

  const [value, setValue] = useState('');

  const inputRef = useRef();

  const sendMessage = () => {
    if (isEditing) {
      confirmEdit();
    } else {
      if (false) {
        // room.sendReply(selectedMessage, value);
        // onCancelReply();
      } else {
        chat.sendMessage(value, 'm.text');
      }
    }
    setValue('');
  };

  const confirmEdit = () => {
    matrix.send(value, 'm.edit', chat.id, activeMessage.id);
    endEditing();
  };

  const endEditing = () => {
    setIsEditing(false);
    setActiveMessage(null);
  };

  const SendIcon = (props) => (
    <Icon
      {...props}
      style={[props.style, {width: 25, height: 25}]}
      name="arrowhead-up"
    />
  );

  useEffect(() => {
    if (isEditing) {
      setValue(activeMessage.content$.getValue().text);
      setTimeout(() => inputRef.current.focus(), 200);
    } else {
      setValue('');
    }
  }, [isEditing]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ios: 'padding', android: 'height'})}
      keyboardVerticalOffset={
        (StatusBar?.currentHeight || 0) + headerHeight + 6
      }>
      {isEditing && (
        <EditView activeMessage={activeMessage} endEditing={endEditing} />
      )}
      <View
        style={{
          paddingHorizontal: 6,
          flexDirection: 'row',
          alignItems: 'flex-end',
          marginVertical: 6,
        }}>
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            {
              backgroundColor: theme['background-basic-color-4'],
              color: theme['text-basic-color'],
              borderWidth: 1.5,
              borderColor: isFocused
                ? theme['color-primary-500']
                : 'transparent',
            },
          ]}
          multiline
          textStyle={{paddingBottom: 6}}
          placeholder={t('composer.placeholder')}
          placeholderTextColor={theme['background-basic-color-1']}
          value={value}
          onChangeText={setValue}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <Button
          style={{borderRadius: 80, width: 25, height: 25}}
          status="primary"
          accessoryLeft={SendIcon}
          onPress={sendMessage}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

function EditView({activeMessage, endEditing}) {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 12,
      }}>
      <View
        style={{
          flex: 1,
          borderLeftWidth: 3,
          borderLeftColor: theme['color-primary-500'],
          paddingHorizontal: 12,
          paddingVertical: 6,
          marginLeft: 22,
        }}>
        <Text status="primary" category="s2" style={{marginBottom: 3}}>
          Editing
        </Text>
        <Text category="s1" numberOfLines={1}>
          {activeMessage.content$.getValue().text}
        </Text>
      </View>
      <Button
        onPress={endEditing}
        appearance="ghost"
        accessoryLeft={(props) => (
          <Icon {...props} name="close" width={30} height={30} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    // marginTop: 12,
    borderRadius: 20,
    marginRight: 6,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 12,
  },
});
