export const isModerator = (
  moderatorId: number,
  currentPlayerId: number | undefined,
  isAllowMembersToManageSession: boolean | undefined,
) => {
  if (isAllowMembersToManageSession) {
    return true;
  }
  return moderatorId === currentPlayerId;
};
