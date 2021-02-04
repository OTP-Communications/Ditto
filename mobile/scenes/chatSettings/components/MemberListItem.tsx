import {Avatar, Divider, ListItem, Text, useTheme} from '@ui-kitten/components';
import {useObservableState} from 'observable-hooks';
import React, {useEffect, useRef} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {matrix} from '@rn-matrix/core';
import ThemeType from '../../../../shared/themes/themeType';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {RectButton} from 'react-native-gesture-handler';
import {Animated} from 'react-native';
import i18n from '../../../../shared/i18n';
import Spacing from '../../../../shared/styles/Spacing';

export default function MemberListItem({
  chat,
  item,
  myMember,
  currentOpen,
  setCurrentOpen,
  currentRoles,
  currentPowerLevels
}) {
  const theme: ThemeType = useTheme();
  const myUserId = matrix.getMyUser().id;
  const user = matrix.getUserById(item.userId);
  const name = useObservableState(user.name$);
  const avatar = useObservableState(user.avatar$);
  const role = currentRoles[item.powerLevel];

  const swipeable = useRef();

  const meCanKick = myMember.powerLevel >= (currentPowerLevels.kick !== undefined ? currentPowerLevels.kick : 50) && myMember.powerLevel > item.powerLevel;
  const meCanBan = myMember.powerLevel >= (currentPowerLevels.ban !== undefined ? currentPowerLevels.ban : 50) && myMember.powerLevel > item.powerLevel;

  const onPress = () => {
    // navigate to profile page
  };

  const confirmRemoveMember = (action) => {
    Alert.alert(
      `${action} ${name}`,
      action === 'Kick'
        ? 'Kicking will remove this user, but they can still rejoin.'
        : 'Banning will prevent this user from rejoining this group.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: action,
          onPress: () => {
            if (action === 'Kick') {
              chat.kick(item.userId).then((res) => {
                if (res) {
                  Alert.alert(
                    i18n.t('chatSettings:insufficientPermissionsTitle'),
                    i18n.t('chatSettings:insufficientPermissions'),
                  );
                }
              });
            } else {
              chat.ban(item.userId).then((res) => {
                if (res) {
                  Alert.alert(
                    i18n.t('chatSettings:insufficientPermissionsTitle'),
                    i18n.t('chatSettings:insufficientPermissions'),
                  );
                }
              });
            }
          },
          style: 'destructive',
        },
      ],
    );
  };

  const MemberAvatar = (props) => (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}>
      <Avatar
        {...props}
        style={{
          marginHorizontal: 8,
          width: 40,
          height: 40,
          backgroundColor: theme['background-basic-color-3'],
        }}
        source={avatar ? {uri: matrix.getHttpUrl(avatar)} : null}
      />
      {!avatar && name && (
        <Text
          style={{
            position: 'absolute',
            color: theme['background-basic-color-1'],
          }}
          category="h5"> 
          {/* This atrocious line is handling names that are emojis. Because the rendering doesn't like those. */}
          {name.charAt(0) === '@' ? name.charAt(1).match(/[a-zA-Z0-9]/g)?.length > 0 ? name.charAt(1) : item.userId.charAt(1) : name.charAt(0).match(/[a-zA-Z0-9]/g)?.length > 0 ? name.charAt(0) : item.userId.charAt(1)}
        </Text>
      )}
      {!avatar && !name && (
        <Text
          style={{
            position: 'absolute',
            color: theme['background-basic-color-1'],
          }}
          category="h5"> 
          {item.userId.charAt(1)}
        </Text>
      )}
    </View>
  );

  const MemberAdminStatus = (props) => (
    <Text appearance="hint" style={{fontSize: 14, marginRight: Spacing.s}}>
      {role ? `${role} (${item.powerLevel})` : item.powerLevel}
    </Text>
  );

  const renderRightAction = (text, color, x, progress) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });
    const pressHandler = () => {
      close();
      switch (text) {
        case 'Kick':
        case 'Ban':
          confirmRemoveMember(text);
          break;
      }
    };
    return (
      <Animated.View style={{flex: 1, transform: [{translateX: trans}]}}>
        <RectButton
          style={[styles.rightAction, {backgroundColor: color}]}
          onPress={pressHandler}>
          <Text style={styles.actionText}>{text}</Text>
        </RectButton>
      </Animated.View>
    );
  };

  const renderRightActions = (progress) => {
    if (item.userId !== myUserId && !meCanBan && !meCanKick) return null
    return (
      <View
        style={{
          width: 192,
          flexDirection: 'row',
        }}>
        {item.userId !== myUserId ? (
          <>
            {meCanKick ? renderRightAction('Kick', theme['color-warning-600'], 64, progress) : null}
            {meCanBan ? renderRightAction(
              'Ban',
              theme['color-danger-default'],
              64,
              progress,
            ) : null}
          </>
        ) : (
          <>
            {renderRightAction('Leave', theme['color-danger-600'], 64, progress)}
          </>
        )}
      </View>
    )
  }

  const close = () => {
    swipeable.current.close();
    setCurrentOpen(null);
  };

  useEffect(() => {
    if (currentOpen && currentOpen !== user.id) {
      close();
    }
  }, [currentOpen]);

  return (
    <Swipeable
      ref={swipeable}
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={10}
      onSwipeableWillOpen={() => setCurrentOpen(user.id)}
      renderRightActions={renderRightActions}>
      <View>
        <ListItem
          onPress={currentOpen ? close : onPress}
          title={`${name}${
            item.userId === myUserId
              ? `  ${i18n.t('chatSettings:youLabel')}`
              : ''
          }`}
          description={user.id}
          accessoryLeft={MemberAvatar}
          accessoryRight={MemberAdminStatus}
          style={{
            backgroundColor: theme['background-basic-color-4'],
            zIndex: 2,
          }}
          activeOpacity={0.4}
        />
        <Divider style={{zIndex: 2}} />
        <View
          style={{
            backgroundColor: theme['background-basic-color-4'],
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
          }}
        />
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: '#497AFC',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
    fontWeight: '600',
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
