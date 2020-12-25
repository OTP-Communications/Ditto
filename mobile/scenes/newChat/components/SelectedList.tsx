import {Icon, useTheme} from '@ui-kitten/components';
import React, {useState} from 'react';
import {FlatList, Pressable, View} from 'react-native';
import SelectedAvatar from './SelectedAvatar';
import UserListItem from './UserListItem';

export default function SelectedList({selectedUsers, removeSelected}) {
  const theme = useTheme();

  const [listView, setListView] = useState(false);

  const renderSelected = ({item}) => {
    if (listView) {
      return <UserListItem item={item} />;
    }
    return <SelectedAvatar user={item} remove={removeSelected} />;
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        borderBottomColor: theme['background-basic-color-2'],
        borderBottomWidth: 4,
      }}>
      <FlatList
        data={selectedUsers}
        renderItem={renderSelected}
        keyExtractor={(i) => i.id}
        horizontal={!listView}
        style={[
          !listView
            ? {minHeight: 75, maxHeight: 75, paddingLeft: 20}
            : {maxHeight: 400},
        ]}
        ListFooterComponent={<View style={{width: 80, height: 80}} />}
      />
      <Pressable
        onPress={() => setListView(!listView)}
        style={({pressed}) => ({
          width: 45,
          height: 45,
          borderRadius: 12,
          margin: 6,
          backgroundColor: pressed
            ? theme['background-basic-color-3']
            : 'transparent',
          justifyContent: 'center',
          alignItems: 'center',
        })}>
        <Icon
          name={listView ? 'radio-button-off' : 'menu'}
          fill={theme['background-basic-color-1']}
          style={{width: 35, height: 35}}
        />
      </Pressable>
    </View>
  );
}
