import { ulid } from 'ulid';
import {
  addGameToStore,
  addPlayerToGameInStore,
  getGameFromStore,
  getPlayersFromStore,
  streamData,
  streamPlayersFromStore,
  updateGameDataInStore,
  removeGameFromStore,
  removeOldGameFromStore,
} from '../repository/firebase';
import { NewGame } from '../types/game';
import { Player } from '../types/player';
import { Status } from '../types/status';
import { removeGameFromCache, resetPlayers, updatePlayerGames } from './players';

export const addNewGame = async (newGame: NewGame): Promise<number> => {
  const player = {
    name: newGame.createdBy,
    id: Math.floor(Math.random() * 1000000000000),
    status: Status.NotStarted,
  };
  const gameData = {
    ...newGame,
    id: Math.floor(Math.random() * 1000000000000),
    average: 0,
    createdById: player.id,
    gameStatus: Status.Started,
  };
  await addGameToStore(gameData.id, gameData);
  await addPlayerToGameInStore(gameData.id, player);
  updatePlayerGames(
    gameData.id,
    gameData.name,
    gameData.createdBy,
    gameData.createdById,
    player.id,
  );

  return gameData.id;
};

export const streamGame = (id: number) => {
  return streamData(id);
};

export const streamPlayers = (id: number) => {
  return streamPlayersFromStore(id);
};

export const getGame = (id: number) => {
  return getGameFromStore(id);
};

export const updateGame = async (gameId: number, updatedGame: any): Promise<boolean> => {
  await updateGameDataInStore(gameId, updatedGame);
  return true;
};

export const resetGame = async (gameId: number) => {
  const game = await getGameFromStore(gameId);
  if (game) {
    const updatedGame = {
      average: 0,
      gameStatus: Status.Started,
    };
    updateGame(gameId, updatedGame);
    await resetPlayers(gameId);
  }
};

export const finishGame = async (gameId: number) => {
  const game = await getGameFromStore(gameId);
  const players = await getPlayersFromStore(gameId);

  if (game && players) {
    const updatedGame = {
      average: getAverage(players),
      gameStatus: Status.Finished,
    };
    updateGame(gameId, updatedGame);
  }
};

export const getAverage = (players: Player[]): number => {
  let values = 0;
  let numberOfPlayersPlayed = 0;
  players.forEach((player) => {
    if (player.status === Status.Finished && player.value && player.value >= 0) {
      values = values + player.value;
      numberOfPlayersPlayed++;
    }
  });
  return Math.round(values / numberOfPlayersPlayed);
};

export const getGameStatus = (players: Player[]): Status => {
  let numberOfPlayersPlayed = 0;
  players.forEach((player: Player) => {
    if (player.status === Status.Finished) {
      numberOfPlayersPlayed++;
    }
  });
  if (numberOfPlayersPlayed === 0) {
    return Status.Started;
  }
  return Status.InProgress;
};

export const updateGameStatus = async (gameId: number): Promise<boolean> => {
  const game = await getGame(gameId);
  if (!game) {
    console.log('Game not found');
    return false;
  }
  const players = await getPlayersFromStore(gameId);
  if (players) {
    const status = getGameStatus(players);
    const dataToUpdate = {
      gameStatus: status,
    };
    const result = await updateGameDataInStore(gameId, dataToUpdate);
    return result;
  }
  return false;
};

export const removeGame = async (gameId: number) => {
  await removeGameFromStore(gameId);
  removeGameFromCache(gameId);
};

export const deleteOldGames = async () => {
  await removeOldGameFromStore();
};
