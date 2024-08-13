import { Status } from './status';

export interface Player {
  name: string;
  id: number;
  status: Status;
  value?: number;
  emoji?: string;
}

export interface PlayerGame {
  id: number;
  name: string;
  isAllowMembersToManageSession?: boolean;
  createdById: number;
  createdBy: string;
  playerId: number;
}
