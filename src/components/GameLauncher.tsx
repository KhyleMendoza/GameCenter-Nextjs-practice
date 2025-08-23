'use client';

import { useState } from 'react';
import TicTacToe from '@/games/tictactoe/TicTacToe';
import ConnectFour from '@/games/connect-four/ConnectFour';
import Snake from '@/games/snake/Snake';

export type GameType = 'tictactoe' | 'connect-four' | 'snake';

interface Game {
  id: GameType;
  name: string;
  description: string;
  icon: string;
  available: boolean;
  component?: React.ComponentType;
}

const games: Game[] = [
  {
    id: 'tictactoe',
    name: 'Tic Tac Toe',
    description: 'Classic 3x3 grid game with AI opponent',
    icon: '⭕',
    available: true,
    component: TicTacToe
  },
  {
    id: 'connect-four',
    name: 'Connect Four',
    description: 'Drop tokens to connect four in a row',
    icon: '🔴',
    available: true,
    component: ConnectFour
  },
  {
    id: 'snake',
    name: 'Snake Game',
    description: 'Classic snake game with growing challenges',
    icon: '🐍',
    available: false,
    component: Snake
  }
];

export default function GameLauncher() {
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);

  const handleGameSelect = (gameId: GameType) => {
    setSelectedGame(gameId);
  };

  const handleBackToMenu = () => {
    setSelectedGame(null);
  };

  // If a game is selected, render that game
  if (selectedGame) {
    const game = games.find(g => g.id === selectedGame);
    if (game?.component) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="p-4">
            <button
              onClick={handleBackToMenu}
              className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              ← Back to Games
            </button>
            <game.component />
          </div>
        </div>
      );
    }
  }

  // Show game selection menu
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Game Center
          </h1>
          <p className="text-xl text-gray-600">
            Choose your game and start playing!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className={`
                relative bg-white border-2 rounded-xl p-6 cursor-pointer transition-all duration-300
                ${game.available 
                  ? 'border-blue-300 hover:border-blue-500 hover:shadow-lg hover:scale-105' 
                  : 'border-gray-200 opacity-60 cursor-not-allowed'
                }
              `}
              onClick={() => game.available && handleGameSelect(game.id)}
            >
              {!game.available && (
                <div className="absolute top-2 right-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                  Coming Soon
                </div>
              )}
              
              <div className="text-center">
                <div className="text-6xl mb-4">{game.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {game.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {game.description}
                </p>
                
                {game.available ? (
                  <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Play Now
                  </button>
                ) : (
                  <div className="mt-4 px-6 py-2 bg-gray-300 text-gray-500 rounded-lg font-medium">
                    Coming Soon
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            More games coming soon! Stay tuned for updates.
          </p>
        </div>
      </div>
    </div>
  );
}
