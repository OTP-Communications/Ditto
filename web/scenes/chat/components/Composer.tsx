import React, {useState, useRef} from 'react';
import {View, Pressable} from 'react-native';
import {useTheme, Icon} from '@ui-kitten/components';
import TextareaAutosize from 'react-textarea-autosize';
import ThemeType from '../../../../shared/themes/themeType';

export default function Composer({room}) {
  const theme: ThemeType = useTheme();
  const inputRef = useRef(null);

  const [value, setValue] = useState<string>('');

  const sendMessage = () => {
    room.sendMessage(value, 'm.text');
    setValue('');
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 2,
        borderTopColor: theme['background-basic-color-2'],
      }}>
      <TextareaAutosize
        ref={inputRef}
        autoFocus
        placeholder="Message..."
        style={{
          ...styles.input,
          color: theme['color-basic-200'],
          backgroundColor: theme['background-basic-color-2'],
        }}
        value={value}
        onChange={({target}) => setValue(target.value)}
        onKeyPress={(e) => {
          e.preventDefault();
          if (e.key === 'Enter' && !e.shiftKey) {
            sendMessage();
          }
        }}
      />
      <Pressable
        style={{
          backgroundColor: theme['color-primary-default'],
          borderRadius: 80,
          margin: 8,
          marginLeft: 0,
          width: 38,
          height: 38,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Icon
          name="arrowhead-up"
          fill={theme['color-basic-300']}
          width={22}
          height={22}
        />
      </Pressable>
    </View>
  );
}

const styles = {
  input: {
    padding: 14,
    paddingTop: 10,
    paddingBottom: 10,
    margin: 8,
    flex: 1,
    borderRadius: 18,
    resize: 'none',
    outlineWidth: 0,
    borderWidth: 0.5,
  },
};
