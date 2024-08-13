import React, { useEffect, useState } from 'react';
import { Game } from '../../../types/game';
import { Player, PlayerGame } from '../../../types/player';
import { CardPicker } from '../../Players/CardPicker/CardPicker';
import { Players } from '../../Players/Players';
import { GameController } from '../GameController/GameController';
import './GameArea.css';
import { Button } from '@material-ui/core';
import ExampleMarkdown from './ExampleMarkdown';
import { Status } from '../../../types/status';
import useMarkdownFiles from '../../../markdowns/useMarkdowns';
import { resetGame } from '../../../service/games';

const savePlayersValuesToCache = (index: number, players: Player[], game: Game, title: string) => {
  const playerValues = players
    .map((player) => ({
      [player.name]: player.value,
    }))
    .reduce((orev: any, currentValue: { [x: string]: number | undefined }) => {
      const [name, value] = Object.entries(currentValue)[0];
      return {
        [name]: value,
        ...orev,
      };
    }, {}) as { [name: string]: number | undefined };

  const playerGame = {
    playerValues,
    averageScore: game.average,
    title: title.replace(/\#+/g, '').trim(),
    gameType: game.gameType,
    gameName: game.name,
  };

  localStorage.setItem(`slide-${index}`, JSON.stringify(playerGame));
};

const saveLocalStorageAsFile = () => {
  const localStorageData = JSON.stringify(
    Object.entries(localStorage)
      .filter(([key, _]) => key.includes('slide'))
      .map((entry) => {
        return [entry[0], JSON.parse(entry[1])];
      }),
    null,
    2,
  );
  const blob = new Blob([localStorageData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'localStorageData.json';
  a.click();
  URL.revokeObjectURL(url);
};

interface GameAreaProps {
  game: Game;
  players: Player[];
  currentPlayerId: number;
}
export const GameArea: React.FC<GameAreaProps> = ({ game, players, currentPlayerId }) => {
  const [isMarkdownView, setIsMarkdownView] = useState(true);
  const [isAtBottom, setBottom] = useState(false);
  const [currentIndex, setIndex] = useState(0);
  const { markdownFiles } = useMarkdownFiles();

  const incrementIndex = () => {
    if (currentIndex + 1 !== markdownFiles.length) {
      savePlayersValuesToCache(
        currentIndex,
        players,
        game,
        markdownFiles[currentIndex].split('\n')[0],
      );
      setIndex(currentIndex + 1);
    }
  };

  useEffect(() => {
    console.log(game);
    if (game.gameStatus === Status.Finished) {
      console.log('Game finished');
      console.log(markdownFiles.length > 0 && markdownFiles);

      setIsMarkdownView(false);

      setTimeout(() => {
        resetGame(game.id);
        incrementIndex();
        setIsMarkdownView(true);
      }, 5_000);
    }
  }, [game.gameStatus, markdownFiles.length]);

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
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyItems: 'center',
          alignContent: 'space-around',
        }}
      >
        <Button
          size='medium'
          variant='outlined'
          onClick={saveLocalStorageAsFile}
          style={{
            border: 'black',
            width: '12rem',
            background: 'darkgrey',
            marginTop: '0.25rem',
            marginBottom: '0.25rem',
            marginRight: '1.25rem',
          }}
        >
          Export Votes
        </Button>
        <Button
          size='medium'
          variant='outlined'
          onClick={() => setIsMarkdownView(!isMarkdownView)}
          style={{
            border: 'black',
            width: '12rem',
            background: 'darkgrey',
            marginTop: '0.25rem',
            marginBottom: '0.25rem',
          }}
        >
          {isMarkdownView ? 'View Current Votes' : 'View Presentation'}
        </Button>
      </div>
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
          <ExampleMarkdown index={currentIndex} markdownFiles={markdownFiles} />
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
