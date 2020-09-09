import React, {useState, useEffect, useRef} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {useTheme, Button, Icon} from '@ui-kitten/components';

export default function Composer({room}) {
  const theme = useTheme();
  const inputRef = useRef(null);

  const [value, setValue] = useState<string>('');

  const SendIcon = (props) => <Icon {...props} name="arrowhead-up" />;

  const sendMessage = () => {
    room.sendMessage(value, 'm.text');
    setValue('');
  };

  useEffect(() => {});

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 2,
        borderTopColor: theme['background-basic-color-2'],
      }}>
      <TextInput
        ref={inputRef}
        style={[styles.input, {color: theme['color-basic-200']}]}
        value={value}
        onChangeText={setValue}
        onSubmitEditing={sendMessage}
        blurOnSubmit={false}
      />
      <Button appearance="ghost" status="primary" accessoryLeft={SendIcon} />
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
