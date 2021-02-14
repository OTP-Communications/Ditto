import React, {useEffect, useState} from 'react';
import {Dimensions, Pressable, ScrollView, TextInput, View} from 'react-native';
import {matrix} from '@rn-matrix/core';
import {Divider, Icon, ListItem, Text, useTheme} from '@ui-kitten/components';
import {AutoDragSortableView} from 'react-native-drag-sort';
import Spacing from '../../../shared/styles/Spacing';
import ThemeType from '../../../shared/themes/themeType';
import i18n from '../../../shared/i18n';
import RolePermissionActionSheet from './components/RolePermissionActionSheet';
import {getRolesAndPermissionsForChat} from '../../../shared/utilities/matrix';

const {width} = Dimensions.get('screen');

export const supportedPermissions = [
  {title: 'Kick', value: 'kick'},
  {title: 'Ban', value: 'ban'},
  {title: 'Invite members', value: 'invite'},
];

export default function RoleEditScreen({route, navigation}) {
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [actionSheetVisible, setActionSheetVisible] = useState<boolean>(false);

  const chat = matrix.getRoomById(route?.params?.chatId);
  const myMember = chat._matrixRoom.getMember(matrix.getMyUser().id);

  const {currentRoles, currentPowerLevels} = getRolesAndPermissionsForChat(
    chat,
  );

  const theme: ThemeType = useTheme();
  const [roles, setRoles] = useState(currentRoles);
  const [powerLevels, setPowerLevels] = useState(currentPowerLevels);

  const canEdit =
    currentPowerLevels.events ? (myMember.powerLevel >= currentPowerLevels.events['m.room.power_levels']) : currentPowerLevels['users_default'] ? (myMember.powerLevel >= currentPowerLevels['users_default']) : false;

  const saveChanges = (powerLevels, roles) => {
    if (JSON.stringify(roles) !== JSON.stringify(currentRoles)) {
      matrix
        .getClient()
        .sendStateEvent(chat.id, 'm.room.roles', roles, '', (e) =>
          console.log({e}),
        );

      matrix
        .getClient()
        .sendStateEvent(chat.id, 'm.room.power_levels', powerLevels, '', (e) =>
          console.log({e}),
        );
    }
    navigation.goBack();
  };

  const renderRoleItem = (item, index) => {
    if (!item && !canEdit) return null;
    return (
      <View
        style={{
          width: width - Spacing.m * 2,
          backgroundColor: theme['background-basic-color-4'],
          height: 50,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Icon
          name="menu"
          width={24}
          height={24}
          fill={theme['text-hint-color']}
          style={{paddingLeft: 30, paddingRight: 20}}
        />
        <Text
          appearance="hint"
          style={{
            width: 40,
            textAlign: 'center',
            marginRight: 20,
            opacity: item ? 1 : 0,
          }}>
          {item}
        </Text>
        <TextInput
          editable={canEdit}
          value={item ? roles[item] : ''}
          placeholder={!item ? 'Type to add role...' : 'Edit role'}
          placeholderTextColor={theme['text-hint-color']}
          selectTextOnFocus
          onChangeText={(val) => handleChange(item, val)}
          style={{
            color: theme['text-basic-color'],
            height: 50,
            flex: 1,
            fontSize: 16,
          }}
        />

        {item && canEdit && (
          <Pressable
            style={{padding: Spacing.m}}
            onPress={() => removeRole(item)}>
            <Icon
              name="close"
              fill={theme['text-hint-color']}
              width={25}
              height={25}
            />
          </Pressable>
        )}
      </View>
    );
  };

  const handleChange = (item, val) => {
    if (item) {
      // editing current role
      setRoles({...roles, [item]: val});
    } else {
      // adding new role
      handleReorder(['-1', ...Object.keys(roles)], true, val);
    }
  };

  const removeRole = (roleNum) => {
    const newRoles = {...roles};
    delete newRoles[roleNum];
    handleReorder(Object.keys(newRoles).reverse());
  };

  const handleReorder = (data, adding = false, val = '') => {
    const roleData = data.filter((i) => !!i);
    const original = {...roles};
    const split = Math.floor(100 / (roleData.length - 1));
    const newRoles = {};
    if (!adding) roleData.reverse();
    roleData.forEach((d, i) => {
      // d = "50" for example
      const roleName = adding && i === 0 ? val : original[d];
      console.log({d, roleName});
      let key = i * split;
      if (i === roleData.length - 1) key = 100;
      newRoles[key] = roleName;
    });
    setRoles(newRoles);
  };

  console.log(currentPowerLevels)

  useEffect(() => {
    if (Object.keys(roles).length === 0) {
      const roles = []
      roles[100] = 'Admin'
      roles[50] = 'Moderator'
      roles[0] = 'Default'
      setRoles(roles);
    }
  }, []);

  useEffect(() => {
    let change = {}
    if (!canEdit) {
      change = {headerRight: () => null}
    }
    navigation.setParams({
      ...route.params,
      saveRoleChanges: () => saveChanges(powerLevels, roles),
    });
    navigation.setOptions({
      ...change
    })
  }, [roles, powerLevels, canEdit]);

  return (
    <>
      <ScrollView>
        <View
          style={{
            height: 50 * (Object.keys(roles).length + 1) + Spacing.m * 2,
            alignItems: 'center',
            paddingTop: Spacing.m,
          }}>
          <AutoDragSortableView
            dataSource={[
              ...Object.keys(roles).sort((a, b) => parseInt(b) - parseInt(a)),
              null,
            ]}
            parentWidth={width}
            childrenWidth={width - Spacing.m * 2}
            childrenHeight={50}
            keyExtractor={(i, index) => index}
            renderItem={renderRoleItem}
            sortable
            onDataChange={handleReorder}
            marginChildrenLeft={Spacing.m}
          />
        </View>
        <View style={{alignSelf: 'stretch', height: 100}}>
          <Text
            category="h6"
            style={{
              alignSelf: 'flex-start',
              marginLeft: Spacing.l,
              marginBottom: canEdit ? Spacing.xs : Spacing.m,
              marginTop: Spacing.xxl,
            }}>
            {i18n.t('chatSettings:rolePermissionsLabel')}
          </Text>
          {canEdit && (
            <Text
              appearance="hint"
              style={{
                alignSelf: 'flex-start',
                marginLeft: Spacing.l,
                marginBottom: Spacing.m,
              }}>
              Tap a row to change permissions
            </Text>
          )}

          {supportedPermissions.map((p) => (
            <>
              <ListItem
                disabled={!canEdit}
                title={p.title}
                accessoryRight={() => (
                  <Text appearance="hint">
                    {powerLevels[p.value] !== undefined
                      ? (roles[powerLevels[p.value]] || powerLevels[p.value])
                      : (currentPowerLevels['users_default'] || 50)}
                  </Text>
                )}
                style={{
                  height: 50,
                  backgroundColor: theme['background-basic-color-4'],
                }}
                onPress={() => {
                  setSelectedPermission(p);
                  setActionSheetVisible(true);
                }}
              />
              <Divider
                style={{backgroundColor: theme['background-basic-color-2']}}
              />
            </>
          ))}
        </View>
      </ScrollView>
      <RolePermissionActionSheet
        visible={actionSheetVisible}
        setVisible={setActionSheetVisible}
        selectedPermission={selectedPermission}
        powerLevels={powerLevels}
        setPowerLevels={setPowerLevels}
        roles={roles}
      />
    </>
  );
}
