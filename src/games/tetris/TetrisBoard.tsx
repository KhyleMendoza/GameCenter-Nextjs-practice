'use client';

import { Board, CellValue } from './tetrisLogic';

interface TetrisBoardProps {
  board: Board;
  gameOver: boolean;
  paused: boolean;
}

// Color mapping for different piece types
const getCellColor = (cellValue: CellValue): string => {
  switch (cellValue) {
    case 0: return 'bg-gray-100 border-gray-200'; // Empty
    case 1: return 'bg-cyan-400 border-cyan-500'; // I piece
    case 2: return 'bg-yellow-400 border-yellow-500'; // O piece
    case 3: return 'bg-purple-400 border-purple-500'; // T piece
    case 4: return 'bg-green-400 border-green-500'; // S piece
    case 5: return 'bg-red-400 border-red-500'; // Z piece
    case 6: return 'bg-blue-400 border-blue-500'; // J piece
    case 7: return 'bg-orange-400 border-orange-500'; // L piece
    default: return 'bg-gray-100 border-gray-200';
  }
};

// Get cell shadow/glow effect
const getCellEffect = (cellValue: CellValue): string => {
  if (cellValue === 0) return '';
  return 'shadow-sm';
};

export default function TetrisBoard({ board, gameOver, paused }: TetrisBoardProps) {
  return (
    <div className="relative">
      <div 
        className={`
          grid grid-cols-10 gap-[1px] p-2 bg-gray-800 rounded-lg border-2 border-gray-700
          ${gameOver ? 'opacity-75' : ''}
          ${paused ? 'opacity-50' : ''}
        `}
        style={{
          gridTemplateRows: 'repeat(20, 1fr)',
          width: '220px',
          height: '440px'
        }}
      >
        {board.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className={`
                border transition-all duration-75
                ${getCellColor(cell)}
                ${getCellEffect(cell)}
              `}
              style={{
                width: '20px',
                height: '20px'
              }}
            />
          ))
        )}
      </div>
      
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg">
            GAME OVER
          </div>
        </div>
      )}
      
      {paused && !gameOver && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg">
            PAUSED
          </div>
        </div>
      )}
    </div>
  );
}

