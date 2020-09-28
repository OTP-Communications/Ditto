import {Icon, ListItem, Text, useTheme} from '@ui-kitten/components';
import React from 'react';
import {Alert, Pressable, View} from 'react-native';
import ActionSheet from '../../../components/ActionSheet';
import {matrix, Message} from '@rn-matrix/core';
import Clipboard from '@react-native-community/clipboard';

export default function ChatActionSheet({
  visible,
  setVisible,
  activeMessage,
  setActiveMessage,
  setIsEditing,
}) {
  const theme = useTheme();
  const myUserId = matrix.getMyUser().id;
  const isMyMessage = activeMessage?.sender.id === myUserId;

  if (!activeMessage) return null;

  const content = activeMessage.content$.getValue();
  const type = activeMessage.type$.getValue();

  const copyMessage = () => {
    Clipboard.setString(content.text);
    hideSheet();
  };

  const editMessage = () => {
    setIsEditing(true);
    setVisible(false);
  };

  const deleteMessage = () => {
    Alert.alert(
      'Delete message?',
      `\"${content.text}\"`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            matrix.deleteMessage(activeMessage);
            hideSheet();
          },
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  };

  const hideSheet = () => {
    setVisible(false);
    setTimeout(() => setActiveMessage(null), 100);
  };

  return (
    <ActionSheet
      visible={visible}
      gestureEnabled={false}
      innerScrollEnabled={false}
      style={{minHeight: 100, paddingTop: 12, paddingBottom: 48}}
      onClose={() => setVisible(false)}>
      <Text
        numberOfLines={2}
        category="s2"
        style={{
          paddingHorizontal: 24,
          paddingVertical: 12,
        }}>
        {content?.text}
      </Text>
      <EmojiButtons message={activeMessage} hideSheet={hideSheet} />
      <View
        style={{
          backgroundColor: theme['background-basic-color-4'],
          borderRadius: 8,
        }}>
        {Message.isTextMessage(type) && (
          <Pressable
            onPress={copyMessage}
            style={({pressed}) => ({
              backgroundColor: pressed
                ? theme['background-basic-color-5']
                : 'transparent',
            })}>
            <ListItem
              title="Copy Text"
              disabled
              accessoryLeft={(props) => <Icon {...props} name="copy" />}
              style={{backgroundColor: 'transparent'}}
            />
          </Pressable>
        )}
        <Pressable
          onPress={copyMessage}
          style={({pressed}) => ({
            backgroundColor: pressed
              ? theme['background-basic-color-4']
              : 'transparent',
          })}>
          <ListItem
            title="Reply"
            disabled
            accessoryLeft={(props) => <Icon {...props} name="undo" />}
            style={{backgroundColor: 'transparent'}}
          />
        </Pressable>
        {Message.isImageMessage(type) && (
          <Pressable
            onPress={copyMessage}
            style={({pressed}) => ({
              backgroundColor: pressed
                ? theme['background-basic-color-4']
                : 'transparent',
            })}>
            <ListItem
              title="Save Image"
              disabled
              accessoryLeft={(props) => <Icon {...props} name="download" />}
              style={{backgroundColor: 'transparent'}}
            />
          </Pressable>
        )}
        {isMyMessage && (
          <>
            {!Message.isImageMessage(type) && (
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
            )}
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

const emojis = ['👍', '❤️', '🎉', '😂', '😭', '😅'];

function EmojiButtons({message, hideSheet}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 12,
      }}>
      {emojis.map((e) => (
        <EmojiButton
          key={e}
          onPress={() => {
            message.toggleReaction(e);
            hideSheet();
          }}>
          <Text style={{fontSize: 24}}>{e}</Text>
        </EmojiButton>
      ))}
    </View>
  );
}

function EmojiButton({children, onPress}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => ({
        backgroundColor: theme['background-basic-color-3'],
        borderRadius: 80,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 6,
        opacity: pressed ? 0.5 : 1,
      })}>
      {children}
    </Pressable>
  );
}
