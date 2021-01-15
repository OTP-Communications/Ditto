import React from 'react';
import {View} from 'react-native';
import {matrix} from '@rn-matrix/core';
import {Button} from '@ui-kitten/components';

export default function RoleEditScreen({route}) {
  const chat = matrix.getRoomById(route?.params?.chatId);

  console.log({state: chat._matrixRoom.currentState});

  const powerLevelEvent = chat._matrixRoom.currentState.getStateEvents(
    'm.room.power_levels',
    '',
  );
  const currentPowerLevels = {
    ...powerLevelEvent.getPrevContent(),
    ...powerLevelEvent.getContent(),
  };

  const roleEvent = chat._matrixRoom.currentState.getStateEvents(
    'm.room.roles',
    '',
  );
  const currentRoles = {
    ...(roleEvent?.getPrevContent() || {}),
    ...(roleEvent?.getContent() || {}),
  };

  console.log({currentPowerLevels, currentRoles});

  const saveChanges = () => {
    console.log('Save.');
    // const client = matrix.getClient();
    // const room = client.getRoom(chat.id);
    // const roomState = room.currentState
    // room.client.sendState(room.id, EventTypes.RoomPowerLevels, content)
    // matrix.getClient().sendStateEvent(
    //   chat.id,
    //   'm.room.power_levels',
    //   {
    //     ...currentPowerLevels,
    //     ban: 60,
    //   },
    //   '',
    //   (e) => console.log({e}),
    // );

    matrix.getClient().sendStateEvent(
      chat.id,
      'm.room.roles',
      {
        ...currentRoles,
        'cool kid': 75,
      },
      '',
      (e) => console.log({e}),
    );
  };

  return <Button onPress={saveChanges}>save</Button>;
}
