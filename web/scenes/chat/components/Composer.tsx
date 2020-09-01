import React, {useState, useRef, useEffect} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {useTheme, Button, Icon} from '@ui-kitten/components';

export default function Composer({room}) {
  const theme = useTheme();

  const [value, setValue] = useState<string>('');

  const inputRef = useRef();

  const SendIcon = (props) => <Icon {...props} name="arrowhead-up" />;

  const sendMessage = () => {
    room.sendMessage(value, 'm.text');
    inputRef?.current?.focus();
  };

  useEffect(() => {
    inputRef?.current?.focus();
  });

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 2,
        borderTopColor: theme['background-basic-color-2'],
        marginTop: 16,
      }}>
      <TextInput
        ref={inputRef}
        style={[styles.input, {color: theme['color-basic-200']}]}
        value={value}
        onChangeText={setValue}
        onSubmitEditing={sendMessage}
      />
      <Button appearance="ghost" status="danger" accessoryLeft={SendIcon} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 50,
    flex: 1,
  },
});
