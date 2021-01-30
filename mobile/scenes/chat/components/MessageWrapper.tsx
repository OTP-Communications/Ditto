import { Avatar, Text, useTheme } from "@ui-kitten/components";
import { useObservableState } from "observable-hooks";
import React, { useCallback, useContext } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemeContext } from "../../../../shared/themes/ThemeProvider";
import Reactions from "./Reactions";
import { getNameColor } from "../../../../shared/utilities/misc";
import { isEmoji } from "../../../../shared/utilities/emoji";
import { matrix, Message } from "@rn-matrix/core";
import Spacing from "../../../../shared/styles/Spacing";

function MessageWrapper({ children, ...props }) {
  const {
    isMe,
    message,
    nextSame,
    prevSame,
    chat,
    onAvatarPress = () => {},
  } = props;

  const theme = useTheme();
  const { themeId } = useContext(ThemeContext);

  const type = useObservableState(message.type$);
  const senderName = useObservableState(message.sender.name$);
  const senderAvatar = useObservableState(message.sender.avatar$);
  const content = useObservableState(message.content$);
  const isDirect = useObservableState(chat.isDirect$);

  const showSenderName =
    !isMe &&
    !prevSame &&
    (!Message.isTextMessage(type) || isEmoji(content?.text));

  const showAvatar = !isDirect && !isMe && !nextSame;

  const renderAvatar = useCallback(() => {
    return (
      <Pressable onPress={() => onAvatarPress(message.sender)}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            marginRight: Spacing.s,
            marginBottom: 3,
          }}
        >
          <Avatar
            size="small"
            source={
              showAvatar && senderAvatar
                ? { uri: matrix.getHttpUrl(senderAvatar) }
                : null
            }
            style={{
              backgroundColor: showAvatar
                ? theme["background-basic-color-3"]
                : "transparent",
            }}
          />
          <Text
            style={{
              position: "absolute",
              opacity: showAvatar ? 0.4 : 0,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {senderName?.charAt(0) === "@"
              ? senderName?.charAt(1).toUpperCase()
              : senderName?.charAt(0).toUpperCase()}
          </Text>
        </View>
      </Pressable>
    );
  }, [senderName, senderAvatar]);

  return (
    <View
      style={[
        styles.wrapper,
        {
          alignItems: isMe ? "flex-end" : "flex-start",
          marginBottom: nextSame ? 3 : 12,
          marginLeft: Spacing.xs,
        },
      ]}
    >
      <View
        style={{
          maxWidth: "85%",
          flexDirection: "row",
          alignItems: "flex-end",
        }}
      >
        {!isMe && renderAvatar()}
        <View style={{ maxWidth: "85%" }}>
          {showSenderName && (
            <Text
              style={{
                fontWeight: "bold",
                marginBottom: 3,
                marginLeft: 18,
                color: getNameColor(message.sender.id, themeId),
              }}
            >
              {senderName}
            </Text>
          )}
          {children}
        </View>
      </View>
      <View
        style={{
          maxWidth: "85%",
          marginLeft: !isMe && !isDirect ? 36 : 0,
        }}
      >
        <Reactions message={message} isMe={isMe} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {},
});

export default React.memo(MessageWrapper);
