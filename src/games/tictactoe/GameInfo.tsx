import { Player, GameMode, Difficulty } from '@/lib/gameLogic';

interface GameInfoProps {
  currentPlayer: Player;
  winner: Player | null;
  isDraw: boolean;
  gameMode: GameMode;
  difficulty: Difficulty;
  onModeSwitch: (mode: GameMode) => void;
  onDifficultySwitch: (difficulty: Difficulty) => void;
  onReset: () => void;
}

export default function GameInfo({ 
  currentPlayer, 
  winner, 
  isDraw, 
  gameMode, 
  difficulty,
  onModeSwitch, 
  onDifficultySwitch,
  onReset 
}: GameInfoProps) {
  const getStatusMessage = () => {
    if (winner) return `Player ${winner} wins!`;
    if (isDraw) return "It's a draw!";
    return `Player ${currentPlayer}'s turn`;
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="text-center">
        <p className="text-xl font-semibold text-gray-700 mb-2">
          {getStatusMessage()}
        </p>
      </div>

      <div className="flex justify-center space-x-2">
        <button
          onClick={() => onModeSwitch('bot')}
          className={`
            px-4 py-2 rounded-lg font-medium transition-colors
            ${gameMode === 'bot' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }
          `}
        >
          vs Bot
        </button>
        <button
          onClick={() => onModeSwitch('1v1')}
          className={`
            px-4 py-2 rounded-lg font-medium transition-colors
            ${gameMode === '1v1' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }
          `}
        >
          1v1
        </button>
      </div>

      {gameMode === 'bot' && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => onDifficultySwitch('easy')}
            className={`
              px-3 py-1 rounded text-sm font-medium transition-colors
              ${difficulty === 'easy' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }
            `}
          >
            Easy
          </button>
          <button
            onClick={() => onDifficultySwitch('medium')}
            className={`
              px-3 py-1 rounded text-sm font-medium transition-colors
              ${difficulty === 'medium' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }
            `}
          >
            Normal
          </button>
          <button
            onClick={() => onDifficultySwitch('hard')}
            className={`
              px-3 py-1 rounded text-sm font-medium transition-colors
              ${difficulty === 'hard' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }
            `}
          >
            Hard
          </button>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={onReset}
          className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          New Game
        </button>
      </div>
    </div>
  );
}
