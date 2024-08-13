import faunadb from 'faunadb';
import { Game } from '../types/game';
import { Player } from '../types/player';

if (!process.env.REACT_APP_FAUNA_KEY) throw new Error('FAUNA_KEY environment variable is not set');

const client = new faunadb.Client({ secret: process.env.REACT_APP_FAUNA_KEY });
const q = faunadb.query;

const gamesCollectionName = 'games';
const playersCollectionName = 'players';

export const addGameToStore = async (gameId: number, data: any) => {
  await client.query(
    q.Create(q.Ref(q.Collection(gamesCollectionName), gameId), { data: { id: gameId, ...data } }),
  );
  return true;
};

export const getGameFromStore = async (id: number): Promise<Game | undefined> => {
  const response = await client.query<{ data: Game }>(
    q.Get(q.Ref(q.Collection(gamesCollectionName), id)),
  );
  return response.data as Game;
};

export const getPlayersFromStore = async (gameId: number): Promise<Player[]> => {
  const response = await client.query<{ data: string[] }>(
    q.Paginate(q.Match(q.Index('players_by_gameId'), gameId)),
  );
  const playerRefs = response.data;
  const getAllPlayersDataQuery = playerRefs.map((ref: any) =>
    q.Get(q.Ref(q.Collection(playersCollectionName), ref.value.id)),
  );
  const players = await client.query<{ data: Player }[]>(getAllPlayersDataQuery);
  return players.map((player: any) => player.data) as Player[];
};

export const getPlayerFromStore = async (
  gameId: number,
  playerId: number,
): Promise<Player | undefined> => {
  const response = await client.query<{ data: Player }>(
    q.Get(q.Ref(q.Collection(playersCollectionName), playerId)),
  );
  return response.data as Player;
};

export const streamData = (id: number) => {
  return client.query(q.Get(q.Ref(q.Collection(gamesCollectionName), id)));
};

export const streamPlayersFromStore = (id: number) => {
  return client.query(q.Paginate(q.Match(q.Index('players_by_gameId'), id)));
};

export const updateGameDataInStore = async (gameId: number, data: any): Promise<boolean> => {
  await client.query(
    q.Update(q.Ref(q.Collection(gamesCollectionName), gameId), { data: { ...data, id: gameId } }),
  );
  return true;
};

export const addPlayerToGameInStore = async (gameId: number, player: Player) => {
  await client.query(
    q.Create(q.Ref(q.Collection(playersCollectionName), player.id), {
      data: { ...player, gameId },
    }),
  );
  return true;
};

export const removePlayerFromGameInStore = async (gameId: number, playerId: number) => {
  await client.query(q.Delete(q.Ref(q.Collection(playersCollectionName), playerId)));
  return true;
};

export const updatePlayerInStore = async (gameId: number, player: Player) => {
  await client.query(
    q.Update(q.Ref(q.Collection(playersCollectionName), player.id), {
      data: { ...player, gameId },
    }),
  );
  return true;
};

export const removeGameFromStore = async (gameId: number) => {
  const players = await client.query<{ data: string[] }>(
    q.Paginate(q.Match(q.Index('players_by_gameId'), gameId)),
  );
  const playerRefs = players.data;
  const deleteAllPlayersQuery = playerRefs.map((ref: any) => q.Delete(ref));
  await client.query(deleteAllPlayersQuery);
  await client.query(q.Delete(q.Ref(q.Collection(gamesCollectionName), gameId)));
  return true;
};

export const removeOldGameFromStore = async () => {
  const monthsToDelete = 6;
  const dateObj = new Date();
  const requiredDate = new Date(dateObj.setMonth(dateObj.getMonth() - monthsToDelete));
  const games = await client.query<{ data: { id: string }[] }>(
    q.Paginate(q.Match(q.Index('games_by_createdAt'), q.LT(requiredDate))),
  );
  const gameRefs = games.data;
  for (let gameRef of gameRefs) {
    const players = await client.query<{ data: Player[] }>(
      q.Paginate(q.Match(q.Index('players_by_gameId'), gameRef.id)),
    );
    const playerRefs = players.data;
    const deleteAllPlayersQuery = playerRefs.map((ref: any) => q.Delete(ref));
    await client.query(deleteAllPlayersQuery);
    await client.query(q.Delete(gameRef));
  }
  return true;
};
