export function getRolesAndPermissionsForChat(chat) {
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

  return {currentRoles, currentPowerLevels}
}