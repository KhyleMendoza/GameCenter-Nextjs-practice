'use client';

import { ConnectFourPlayer, ConnectFourGameMode, ConnectFourDifficulty } from '@/lib/gameLogic';

interface ConnectFourGameInfoProps {
  currentPlayer: ConnectFourPlayer;
  winner: ConnectFourPlayer | null;
  isDraw: boolean;
  gameMode: ConnectFourGameMode;
  difficulty: ConnectFourDifficulty;
  onRestart: () => void;
  onModeChange: (mode: ConnectFourGameMode) => void;
  onDifficultyChange: (difficulty: ConnectFourDifficulty) => void;
  moveCount: number;
}

export default function ConnectFourGameInfo({
  currentPlayer,
  winner,
  isDraw,
  gameMode,
  difficulty,
  onRestart,
  onModeChange,
  onDifficultyChange,
  moveCount
}: ConnectFourGameInfoProps) {
  const getPlayerIcon = (player: ConnectFourPlayer) => {
    return player === 'red' ? '🔴' : '🟡';
  };

  const getPlayerName = (player: ConnectFourPlayer) => {
    return player === 'red' ? 'Red' : 'Yellow';
  };

  const getGameStatus = () => {
    if (winner) {
      return `${getPlayerIcon(winner)} ${getPlayerName(winner)} Wins!`;
    }
    if (isDraw) {
      return "🤝 It's a Draw!";
    }
    return `${getPlayerIcon(currentPlayer)} ${getPlayerName(currentPlayer)}'s Turn`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
      {/* Game Status */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Connect Four
        </h2>
        <div className="text-xl font-semibold mb-2">
          {getGameStatus()}
        </div>
        <div className="text-sm text-gray-600">
          Moves: {moveCount}
        </div>
      </div>

      {/* Game Controls */}
      <div className="space-y-4">
        {/* Game Mode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Game Mode
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onModeChange('1v1')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex-1 ${
                gameMode === '1v1'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              👥 1v1
            </button>
            <button
              onClick={() => onModeChange('bot')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex-1 ${
                gameMode === 'bot'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🤖 vs Bot
            </button>
          </div>
        </div>

        {/* Difficulty (only shown in bot mode) */}
        {gameMode === 'bot' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bot Difficulty
            </label>
            <div className="flex gap-1">
              {(['easy', 'medium', 'hard'] as ConnectFourDifficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => onDifficultyChange(diff)}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors flex-1 text-sm ${
                    difficulty === diff
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Restart Button */}
        <button
          onClick={onRestart}
          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          🔄 New Game
        </button>
      </div>

      {/* Game Rules */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-800 mb-2">How to Play:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Drop tokens into columns</li>
          <li>• Connect 4 in a row to win</li>
          <li>• Horizontal, vertical, or diagonal</li>
          <li>• Red player goes first</li>
        </ul>
      </div>
    </div>
  );
}
