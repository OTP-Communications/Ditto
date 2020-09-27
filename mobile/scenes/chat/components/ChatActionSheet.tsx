import {Icon, ListItem, Text, useTheme} from '@ui-kitten/components';
import React from 'react';
import {Pressable, View} from 'react-native';
import ActionSheet from '../../../components/ActionSheet';
import {matrix} from '@rn-matrix/core';

export default function ChatActionSheet({
  visible,
  setVisible,
  activeMessage,
  editMessage,
}) {
  const theme = useTheme();
  const myUserId = matrix.getMyUser().id;
  const isMyMessage = activeMessage?.sender.id === myUserId;

  if (!activeMessage) return null;

  const content = activeMessage.content$.getValue();

  const copyMessage = () => {
    //
  };

  const deleteMessage = () => {
    //
  };

  return (
    <ActionSheet
      visible={visible}
      gestureEnabled={false}
      innerScrollEnabled={false}
      style={{minHeight: 100, paddingTop: 12, paddingBottom: 48}}
      onClose={() => setVisible(false)}>
      {/* <EmojiButtons
      message={selectedMessage}
      setActionSheetVisible={setActionSheetVisible}
      setSelectedMessage={setSelectedMessage}
    /> */}
      <Text
        numberOfLines={2}
        category="s2"
        style={{
          paddingHorizontal: 24,
          paddingVertical: 12,
        }}>
        {content?.text}
      </Text>
      <View
        style={{
          backgroundColor: theme['background-basic-color-3'],
          borderRadius: 8,
        }}>
        <Pressable
          onPress={editMessage}
          style={({pressed}) => ({
            backgroundColor: pressed
              ? theme['background-basic-color-4']
              : 'transparent',
          })}>
          <ListItem
            title="Copy Text"
            disabled
            accessoryLeft={(props) => <Icon {...props} name="copy" />}
            style={{backgroundColor: 'transparent'}}
          />
        </Pressable>
        {isMyMessage && (
          <>
            <Pressable
              onPress={editMessage}
              style={({pressed}) => ({
                backgroundColor: pressed
                  ? theme['background-basic-color-4']
                  : 'transparent',
              })}>
              <ListItem
                title="Edit"
                disabled
                accessoryLeft={(props) => <Icon {...props} name="edit" />}
                style={{backgroundColor: 'transparent'}}
              />
            </Pressable>
            <Pressable
              onPress={deleteMessage}
              style={({pressed}) => ({
                backgroundColor: pressed
                  ? theme['background-basic-color-4']
                  : 'transparent',
              })}>
              <ListItem
                title="Delete"
                disabled
                accessoryLeft={(props) => <Icon {...props} name="trash" />}
                style={{backgroundColor: 'transparent'}}
              />
            </Pressable>
          </>
        )}
      </View>
    </ActionSheet>
  );
}
