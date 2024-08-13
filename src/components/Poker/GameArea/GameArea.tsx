import React, { useState } from 'react';
import { Game } from '../../../types/game';
import { Player } from '../../../types/player';
import { CardPicker } from '../../Players/CardPicker/CardPicker';
import { Players } from '../../Players/Players';
import { GameController } from '../GameController/GameController';
import './GameArea.css';
import { Button } from '@material-ui/core';
import { useRemark } from 'react-remark';
import ExampleMarkdown from './ExampleMarkdown';

interface GameAreaProps {
  game: Game;
  players: Player[];
  currentPlayerId: number;
}
export const GameArea: React.FC<GameAreaProps> = ({ game, players, currentPlayerId }) => {
  const [isMarkdownView, setIsMarkdownView] = useState(true);
  const [isAtBottom, setBottom] = useState(false);
  const [reactContent, setMarkdownSource] = useRemark();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '92.5vh',
        justifyItems: 'center',
        alignItems: 'center',
      }}
    >
      <Button
        size='medium'
        variant='outlined'
        onClick={() => setIsMarkdownView(!isMarkdownView)}
        style={{ border: 'black', width: '12rem', background: 'darkgrey', marginTop: '2rem' }}
      >
        {isMarkdownView ? 'View Current Votes' : 'View Presentation'}
      </Button>
      <div
        className='ContentArea'
        style={{
          background: 'ffffffa1',
          height: '70vh',
          width: '70vw',
          backgroundColor: 'gainsboro',
          padding: '3rem',
        }}
      >
        {isMarkdownView ? (
          <ExampleMarkdown />
        ) : (
          <Players game={game} players={players} currentPlayerId={currentPlayerId} />
        )}
        <div
          style={{
            position: 'absolute',
            bottom: isAtBottom ? '0vh' : '20vh',
            left: '39vw',
          }}
        >
          <Button
            size='medium'
            variant='outlined'
            onClick={() => setBottom(!isAtBottom)}
            style={{ background: 'white' }}
          >
            Move {isAtBottom ? 'Up' : 'Down'}
          </Button>
          <GameController game={game} currentPlayerId={currentPlayerId} />
        </div>
      </div>
      <div className='Footer'>
        <CardPicker game={game} players={players} currentPlayerId={currentPlayerId} />
      </div>
    </div>
  );
};

export default GameArea;
