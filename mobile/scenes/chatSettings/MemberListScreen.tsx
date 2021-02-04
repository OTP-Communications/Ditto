import { useTheme } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import {FlatList, View} from 'react-native';
import MemberListItem from './components/MemberListItem';
import {matrix} from '@rn-matrix/core'
import {getRolesAndPermissionsForChat} from '../../../shared/utilities/matrix';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Spacing from '../../../shared/styles/Spacing';
import ThemeType from '../../../shared/themes/themeType';

export default function MemberListScreen({route}) {
  const theme: ThemeType = useTheme()
  const chat = matrix.getRoomById(route?.params?.chatId);
  const insets = useSafeAreaInsets()

  const [members, setMembers] = useState([]);
  const [currentOpen, setCurrentOpen] = useState(null); // which swipeable row is open

  const myMember = chat._matrixRoom.getMember(matrix.getMyUser().id);
  const {currentRoles, currentPowerLevels} = getRolesAndPermissionsForChat(
    chat,
  );

  const renderMemberListItem = ({item}) => {
      return (
        <MemberListItem
          chat={chat}
          item={item}
          myMember={myMember}
          currentOpen={currentOpen}
          setCurrentOpen={setCurrentOpen}
          currentRoles={currentRoles}
          currentPowerLevels={currentPowerLevels}
        />
      );
  };

  const getMembers = async () => {
    const client = matrix.getClient();
    const room = client.getRoom(chat.id);
    await room.loadMembersIfNeeded();
    setMembers(room.getJoinedMembers());
  };

  const clearMembers = () => {
    const client = matrix.getClient();
    const room = client.getRoom(chat.id);
    room.clearLoadedMembersIfNeeded();
  };

  useEffect(() => {
    getMembers();
    return () => {
      clearMembers();
    };
  }, []);

  return (
    <View style={{flex: 1, paddingBottom: insets.bottom, backgroundColor: theme['background-basic-color-4']}}>
      <FlatList
        data={members}
        renderItem={renderMemberListItem}
        windowSize={20}
        initialNumToRender={20}
        keyExtractor={item => item.userId}
        contentInset={{bottom: Spacing.xl}}
      />
    </View>
  );
}
