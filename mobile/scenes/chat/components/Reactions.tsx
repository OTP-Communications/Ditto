import {Text, useTheme} from '@ui-kitten/components';
import React from 'react';
import {Pressable, View, StyleSheet} from 'react-native';
import {matrix} from '@rn-matrix/core';
import {useObservableState} from 'observable-hooks';

export default function Reactions({message, isMe}) {
  const theme = useTheme();
  const myUserId = matrix.getMyUser().id;

  const reactions: any[] | undefined = useObservableState(message.reactions$);

  if (!reactions) return null;

  const toggleReaction = (key: string) => {
    message.toggleReaction(key);
  };

  return (
    <View
      style={[styles.wrapper, {flexDirection: isMe ? 'row-reverse' : 'row'}]}>
      {Object.keys(reactions).map((key: any) => {
        const isSelected = !!reactions[key][myUserId];
        const selectedStyle = {
          backgroundColor: theme['color-primary-600'],
          borderWidth: 1.8,
          borderColor: theme['color-primary-700'],
        };
        const toggle = () => toggleReaction(key);
        return (
          <Pressable key={key} onPress={toggle} style={styles.button}>
            <View
              style={[
                styles.buttonContent,
                isSelected
                  ? selectedStyle
                  : {
                      backgroundColor: theme['color-basic-900'],
                      borderColor: theme['color-basic-1000'],
                    },
              ]}>
              <Text
                style={
                  {}
                  // Platform.OS === 'android'
                  //   ? {
                  //       // fontFamily: 'NotoColorEmoji',
                  //       marginTop: -5,
                  //     }
                  //   : {}
                }>
                {key}
              </Text>
              <Text
                style={{
                  color: theme['color-basic-100'],
                  fontSize: 16,
                }}>
                &nbsp;{`${Object.keys(reactions[key]).length}`}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    zIndex: 2,
    flexWrap: 'wrap',
    marginVertical: 6,
  },
  button: {
    width: 50,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderRadius: 30,
    overflow: 'hidden',
    marginHorizontal: 2,
  },
  buttonContent: {
    width: 50,
    height: 30,
    paddingTop: 2,
    borderRadius: 30,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
