import { ulid } from 'ulid';
import {
  addPlayerToGameInStore,
  getGameFromStore,
  getPlayerFromStore,
  getPlayersFromStore,
  removePlayerFromGameInStore,
  updatePlayerInStore,
} from '../repository/firebase';
import { getPlayerGamesFromCache, updatePlayerGamesInCache } from '../repository/localStorage';
import { Player, PlayerGame } from '../types/player';
import { Status } from '../types/status';
import { updateGameStatus } from './games';

export const addPlayer = async (gameId: number, player: Player) => {
  const game = await getGameFromStore(gameId);
  if (game) {
    addPlayerToGameInStore(gameId, player);
  }
};

export const removePlayer = async (gameId: number, playerId: number) => {
  const game = await getGameFromStore(gameId);
  if (game) {
    removePlayerFromGameInStore(gameId, playerId);
  }
};

export const updatePlayerValue = async (
  gameId: number,
  playerId: number,
  value: number,
  randomEmoji: string,
) => {
  const player = await getPlayerFromStore(gameId, playerId);

  if (player) {
    const updatedPlayer = {
      ...player,
      value: value,
      emoji: randomEmoji,
      status: Status.Finished,
    };
    await updatePlayerInStore(gameId, updatedPlayer);
    await updateGameStatus(gameId);
    return true;
  }
  return false;
};

export const getPlayerRecentGames = async (): Promise<PlayerGame[]> => {
  let playerGames: PlayerGame[] = getPlayerGamesFromCache();
  return playerGames;
};

export const getCurrentPlayerId = (gameId: number): number | undefined => {
  let playerGames: PlayerGame[] = getPlayerGamesFromCache();

  const game = playerGames.find((playerGame) => playerGame.id === gameId);

  return game && game.playerId;
};

export const updatePlayerGames = (
  gameId: number,
  gameName: string,
  createdBy: string,
  createdById: number,
  playerId: number,
) => {
  let playerGames: PlayerGame[] = getPlayerGamesFromCache();

  playerGames.push({
    id: gameId,
    name: gameName,
    createdById: createdById,
    createdBy: createdBy,
    playerId,
  });

  updatePlayerGamesInCache(playerGames);
};

export const isCurrentPlayerInGame = async (gameId: number): Promise<boolean> => {
  const playerGames = getPlayerGamesFromCache();
  const found = playerGames.find((playerGames) => playerGames.id === gameId);
  if (found) {
    const player = await getPlayerFromStore(found.id, found.playerId);

    //Remove game from cache is player is no longer in the game
    if (!player) {
      removeGameFromCache(found.id);
      return false;
    }
    return true;
  }
  return false;
};

export const isPlayerInGameStore = async (gameId: number, playerId: number) => {
  const player = await getPlayerFromStore(gameId, playerId);
  return player ? true : false;
};

export const removeGameFromCache = (gameId: number) => {
  const playerGames = getPlayerGamesFromCache();
  updatePlayerGamesInCache(playerGames.filter((playerGame) => playerGame.id !== gameId));
};

export const addPlayerToGame = async (gameId: number, playerName: string): Promise<boolean> => {
  const joiningGame = await getGameFromStore(gameId);

  if (!joiningGame) {
    console.log('Game not found');
    return false;
  }
  const newPlayer = {
    name: playerName,
    id: Math.floor(Math.random() * 1000000000000),
    status: Status.NotStarted,
  };

  updatePlayerGames(
    joiningGame.id,
    joiningGame.name,
    joiningGame.createdBy,
    joiningGame.createdById,
    newPlayer.id,
  );
  await addPlayerToGameInStore(gameId, newPlayer);

  return true;
};

export const resetPlayers = async (gameId: number) => {
  const players = await getPlayersFromStore(gameId);

  players.forEach(async (player) => {
    const updatedPlayer: Player = {
      ...player,
      status: Status.NotStarted,
      value: 0,
    };
    await updatePlayerInStore(gameId, updatedPlayer);
  });
};
