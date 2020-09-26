import {Button, Icon, Input, useTheme} from '@ui-kitten/components';
import React, {useRef, useState} from 'react';
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

export default function Composer({chat}) {
  const theme = useTheme();
  const {t} = useTranslation('messages');
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  const [value, setValue] = useState('');

  const sendMessage = () => {
    if (false) {
      // room.sendReply(selectedMessage, value);
      // onCancelReply();
    } else {
      chat.sendMessage(value, 'm.text');
    }
    setValue('');
  };

  const SendIcon = (props) => (
    <Icon
      {...props}
      style={[props.style, {width: 25, height: 25}]}
      name="arrowhead-up"
    />
  );

  return (
    <KeyboardAvoidingView
      style={{
        paddingHorizontal: 6,
        backgroundColor: theme['color-basic-1100'],
        flexDirection: 'row',
        alignItems: 'flex-end',
      }}
      behavior={Platform.select({ios: 'padding', android: 'height'})}
      keyboardVerticalOffset={
        (StatusBar?.currentHeight || 0) + headerHeight + 6
      }>
      <Input
        style={[
          styles.input,
          {backgroundColor: theme['background-basic-color-4']},
        ]}
        multiline
        textStyle={{paddingBottom: 6}}
        placeholder={t('composer.placeholder')}
        placeholderTextColor={theme['background-basic-color-1']}
        value={value}
        onChangeText={setValue}
      />
      <Button
        style={{borderRadius: 80, width: 25, height: 25, marginBottom: 6}}
        status="primary"
        accessoryLeft={SendIcon}
        onPress={sendMessage}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    marginTop: 12,
    borderRadius: 20,
    marginRight: 6,
  },
});
