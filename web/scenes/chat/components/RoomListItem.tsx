import React from 'react';
import {useObservableState} from 'observable-hooks';
import {StyleSheet, Image, View, Pressable} from 'react-native';
import moment from 'moment';
import {Text} from '@ui-kitten/components';
// import Icon from './Icon';

const avatarSize = 50;

export default function RoomListItem({room, onPress, selected = false}) {
  const name: string | undefined = useObservableState(room.name$);
  const avatar: string | undefined = useObservableState(room.avatar$);
  const snippet: any = useObservableState(room.snippet$);
  const readState = useObservableState(room.readState$);

  const handleOnPress = () => {
    onPress(room);
  };

  const renderTime = () => {
    const now = moment();
    const time = moment(snippet?.timestamp);
    const dayDiff = now.diff(time, 'days');
    if (dayDiff > 1) {
      if (dayDiff > 7) {
        return time.format('MMM D');
      } else if (dayDiff > 365) {
        return time.format('MMM D, YYYY');
      } else {
        return time.format('ddd');
      }
    } else {
      return time.fromNow();
    }
  };

  const unread = readState === 'unread';

  return (
    <Pressable onPress={handleOnPress} style={{cursor: 'pointer'}}>
      <View style={[styles.rowWrapper, selected ? styles.selected : {}]}>
        {avatar ? (
          <Image
            source={
              room.getAvatarUrl(avatarSize)
                ? {uri: room.getAvatarUrl(avatarSize)}
                : {}
            }
            style={styles.avatar}
          />
        ) : (
          <DefaultImage letter={name?.charAt(0)} />
        )}

        <View style={{flex: 1, marginRight: 12}}>
          <View style={styles.textWrapper}>
            <Text
              style={[styles.title, unread ? {fontWeight: '800'} : {}]}
              numberOfLines={1}
              selectable={false}>
              {room.isEncrypted() && (
                <>
                  {/* <Icon name="lock" color="#888" size={18} /> */}
                  &nbsp;
                </>
              )}
              {name}
            </Text>
            <Text
              style={{fontSize: 14, color: '#444'}}
              selectable={false}
              numberOfLines={1}>
              {renderTime()}
            </Text>
          </View>
          <View style={styles.textWrapper}>
            <Text
              style={[
                styles.snippet,
                unread ? {color: '#fff', fontWeight: '600'} : {},
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
              selectable={false}>
              {snippet?.content}
            </Text>
            {unread && <UnreadIndicator />}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const DefaultImage = ({letter}: {letter: string | undefined}) => (
  <View
    style={[
      styles.avatar,
      {backgroundColor: '#666', justifyContent: 'center', alignItems: 'center'},
    ]}>
    <Text style={styles.defaultAvatarLetter}>{letter?.toUpperCase()}</Text>
  </View>
);

const UnreadIndicator = () => <View style={styles.unreadIndicator} />;

const styles = StyleSheet.create({
  rowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    marginHorizontal: 6,
    marginVertical: 3,
    borderRadius: 14,
  },
  selected: {
    backgroundColor: '#292929',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginHorizontal: 12,
  },
  textWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    maxWidth: 200,
  },
  snippet: {
    // maxWidth: 300,
    flex: 1,
    color: '#444',
    fontSize: 14,
    marginTop: 6,
    marginRight: 6,
  },
  defaultAvatarLetter: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ddd',
  },
  unreadIndicator: {
    backgroundColor: 'dodgerblue',
    width: 16,
    height: 16,
    borderRadius: 40,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
});
