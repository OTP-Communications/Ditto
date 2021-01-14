import React from 'react';
import {View} from 'react-native';
import {matrix} from '@rn-matrix/core';
import {Button} from '@ui-kitten/components';

export default function RoleEditScreen({route}) {
  const chat = matrix.getRoomById(route?.params?.chatId);

  const saveChanges = () => {
    console.log('Save.', matrix.getClient());
    // const client = matrix.getClient();
    // const room = client.getRoom(chat.id);
    // const roomState = room.currentState
    // room.client.sendState(room.id, EventTypes.RoomPowerLevels, content)
    matrix.getClient().sendStateEvent(
      chat.id,
      'm.room.power_levels',
      {
        ban: 50,
        events: {
          'm.room.name': 100,
          'm.room.power_levels': 100,
        },
        events_default: 0,
        invite: 50,
        kick: 50,
        notifications: {
          room: 20,
        },
        redact: 80,
        state_default: 50,
        users_default: 0,
      },
      '',
    );
  };

  return <Button onPress={saveChanges}>save</Button>;
}
