import {Divider, Icon, ListItem, Text, useTheme} from '@ui-kitten/components';
import React from 'react';
import {Alert, Pressable, View} from 'react-native';
import ActionSheet from '../../../components/ActionSheet';
import {matrix, Message} from '@rn-matrix/core';
import Clipboard from '@react-native-community/clipboard';
import Spacing from '../../../../shared/styles/Spacing';

export default function RolePermissionActionSheet({
  visible,
  setVisible,
  selectedPermission,
  roles,
  powerLevels,
  setPowerLevels
}) {
  const theme = useTheme();

  if (!selectedPermission) return null;

  const selectRole = (r) => {
    const newPowerLevels = {...powerLevels}
    newPowerLevels[selectedPermission.value] = parseInt(r)
    setPowerLevels(newPowerLevels)
    hideSheet()
  }

  const hideSheet = () => {
    setVisible(false);
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
        category="s1"
        style={{
          paddingHorizontal: Spacing.xl,
          paddingVertical: Spacing.s
        }}>
        {selectedPermission.title}
      </Text>
      <Text
        numberOfLines={2}
        appearance="hint"
        style={{
          paddingHorizontal: Spacing.xl,
          paddingBottom: 12,
        }}>
        Tap to select the highest role that should be able to do this action
      </Text>
      <View
        style={{
          backgroundColor: theme['background-basic-color-4'],
          borderRadius: 8,
        }}>
        {Object.keys(roles)
          .reverse()
          .map((r) => (
            <>
              <ListItem title={roles[r]} onPress={() => selectRole(r)} style={{paddingLeft: Spacing.l, height: 50, backgroundColor: theme['background-basic-color-3']}} />
              <Divider
                style={{backgroundColor: theme['background-basic-color-2']}}
              />
            </>
          ))}
      </View>
    </ActionSheet>
  );
}
