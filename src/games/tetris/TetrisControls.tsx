'use client';

interface TetrisControlsProps {
  score: number;
  lines: number;
  level: number;
  gameOver: boolean;
  paused: boolean;
  onPause: () => void;
  onReset: () => void;
}

export default function TetrisControls({
  score,
  lines,
  level,
  gameOver,
  paused,
  onPause,
  onReset
}: TetrisControlsProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-bold text-gray-800 mb-4 text-lg">Game Stats</h3>
      
      {/* Score Display Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg p-3 text-center shadow-sm">
          <div className="text-blue-600 font-bold text-xl">{score.toLocaleString()}</div>
          <div className="text-gray-600 text-sm">Score</div>
        </div>
        
        <div className="bg-white rounded-lg p-3 text-center shadow-sm">
          <div className="text-green-600 font-bold text-xl">{lines}</div>
          <div className="text-gray-600 text-sm">Lines</div>
        </div>
        
        <div className="bg-white rounded-lg p-3 text-center shadow-sm">
          <div className="text-purple-600 font-bold text-xl">{level}</div>
          <div className="text-gray-600 text-sm">Level</div>
        </div>
        
        <div className="bg-white rounded-lg p-3 text-center shadow-sm">
          <div className="text-orange-600 font-bold text-xl">{10 - (lines % 10)}</div>
          <div className="text-gray-600 text-sm">To Next Level</div>
        </div>
      </div>
      
      {/* Level Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Level Progress</span>
          <span>{lines % 10}/10 lines</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-purple-600 h-3 rounded-full transition-all duration-300 flex items-center justify-center"
            style={{ width: `${(lines % 10) * 10}%` }}
          >
            {(lines % 10) > 0 && (
              <span className="text-white text-xs font-bold">
                {(lines % 10) * 10}%
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Control Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {!gameOver && (
          <button
            onClick={onPause}
            className={`
              px-4 py-3 rounded-lg font-medium transition-colors text-sm
              ${paused 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-yellow-600 hover:bg-yellow-700 text-white'
              }
            `}
          >
            {paused ? '▶️ Resume' : '⏸️ Pause'}
          </button>
        )}
        
        <button
          onClick={onReset}
          className={`
            px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm
            ${!gameOver && 'col-start-2'}
          `}
        >
          🔄 {gameOver ? 'New Game' : 'Restart'}
        </button>
      </div>

    </div>
  );
}

