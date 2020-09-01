import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {useObservableState} from 'observable-hooks';
import MessageItem from './message/MessageItem';
import Composer from './Composer';

export default function RoomView({currentRoom: room}: any) {
  const [isLoading, setIsLoading] = useState(false);
  const messageList: any = useObservableState(room.messages$);
  const typing: any = useObservableState(room.typing$);
  const atStart = useObservableState(room.atStart$);
  const [timeline, setTimeline] = useState(messageList);

  const handleEndReached = async () => {
    if (!atStart && !isLoading) {
      setIsLoading(true);
      await room.fetchPreviousMessages();
      setIsLoading(false);
    }
  };

  const renderMessageItem = ({item: messageId, index}) => {
    return (
      <MessageItem
        roomId={room.id}
        messageId={messageId}
        prevMessageId={messageList[index + 1] ? messageList[index + 1] : null}
        nextMessageId={messageList[index - 1] ? messageList[index - 1] : null}
        // onPress={onPress}
        // onLongPress={onLongPress}
        // renderTypingIndicator={renderTypingIndicator}
        // showReactions={showReactions}
        styles={styles}
        // myBubbleStyle={myBubbleStyle}
        // otherBubbleStyle={otherBubbleStyle}
        // accentColor={accentColor}
      />
    );
  };

  const renderComposer = () => {
    return <Composer room={room} />;
  };

  useEffect(() => {
    room.fetchPreviousMessages();
  }, []);

  useEffect(() => {
    // mark as read
    room.sendReadReceipt();

    // We put loading and typing indicator into the Timeline to have better
    // visual effects when we swipe to top or bottom
    if (messageList) {
      const tempTimeline = [...messageList];
      if (isLoading) tempTimeline.push('loading');
      if (typing.length > 0) tempTimeline.unshift('typing');
      setTimeline(tempTimeline);
    }
  }, [isLoading, messageList, room, typing]);

  return (
    <View style={styles.wrapper}>
      <FlatList
        inverted
        disableVirtualization={true}
        data={timeline}
        renderItem={renderMessageItem}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        keyExtractor={(item) => item}
        ListHeaderComponent={renderComposer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 3,
  },
});
