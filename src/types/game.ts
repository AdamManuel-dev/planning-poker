import { CardConfig } from '../components/Players/CardPicker/CardConfigs';
import { Status } from './status';

export interface Game {
  id: number;
  name: string;
  average: number;
  gameStatus: Status;
  gameType?: GameType | GameType.Fibonacci;
  isAllowMembersToManageSession?: boolean;
  cards: CardConfig[];
  createdBy: string;
  createdById: number;
  createdAt: string;
  updatedAt?: string;
}

export interface NewGame {
  name: string;
  gameType: string;
  cards: CardConfig[];
  isAllowMembersToManageSession?: boolean;
  createdBy: string;
  createdAt: string;
}

export enum GameType {
  Fibonacci = 'Fibonacci',
  ShortFibonacci = 'ShortFibonacci',
  TShirt = 'TShirt',
  TShirtAndNumber = 'TShirtAndNumber',
  Custom = 'Custom',
}
