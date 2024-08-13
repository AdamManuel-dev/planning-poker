import { CircularProgress, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { getGameFromStore, getPlayersFromStore } from '../../repository/firebase';
import { getCurrentPlayerId } from '../../service/players';
import { Game } from '../../types/game';
import { Player } from '../../types/player';
import { GameArea } from './GameArea/GameArea';
import './Poker.css';

export const Poker = () => {
  let { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [game, setGame] = useState<Game | undefined>(undefined);
  const [players, setPlayers] = useState<Player[] | undefined>(undefined);
  const [loading, setIsLoading] = useState(true);
  const [currentPlayerId, setCurrentPlayerId] = useState<number | undefined>(undefined);

  useEffect(() => {
    let effectCleanup = true;

    if (effectCleanup) {
      const currentPlayerId = getCurrentPlayerId(Number.parseInt(id));
      if (!currentPlayerId) {
        history.push(`/join/${id}`);
      }

      setCurrentPlayerId(currentPlayerId);
      setIsLoading(true);
    }

    const fetchGame = async () => {
      const gameData = await getGameFromStore(Number.parseInt(id));
      if (effectCleanup) {
        if (gameData) {
          setGame(gameData);
        }
        setIsLoading(false);
      }
    };

    const fetchPlayers = async () => {
      const playersData = await getPlayersFromStore(Number.parseInt(id));
      if (effectCleanup) {
        setPlayers(playersData);
        const currentPlayerId = getCurrentPlayerId(Number.parseInt(id));
        if (!playersData.find((player) => player.id === currentPlayerId)) {
          history.push(`/join/${id}`);
        }
      }
    };

    fetchGame();
    fetchPlayers();

    const intervalId = setInterval(() => {
      // TODO: Watch for changes using the FaunaDB stream feature, instead of polling
      fetchGame();
      fetchPlayers();
    }, 500);

    return () => {
      effectCleanup = false;
      clearInterval(intervalId);
    };
  }, [id, history]);

  if (loading) {
    return (
      <div className='PokerLoading'>
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      {game && players && currentPlayerId ? (
        <GameArea game={game} players={players} currentPlayerId={currentPlayerId} />
      ) : (
        <Typography>Game not found</Typography>
      )}
    </>
  );
};

export default Poker;
