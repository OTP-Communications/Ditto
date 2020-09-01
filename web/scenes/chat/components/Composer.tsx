import React, {useState, useRef, useEffect} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {useTheme, Button, Icon} from '@ui-kitten/components';

export default function Composer({room}) {
  const theme = useTheme();

  const [value, setValue] = useState<string>('');

  const SendIcon = (props) => <Icon {...props} name="arrowhead-up" />;

  const sendMessage = () => {
    room.sendMessage(value, 'm.text');
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
        style={[styles.input, {color: theme['color-basic-200']}]}
        value={value}
        onChangeText={setValue}
        onSubmitEditing={sendMessage}
        multiline
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
