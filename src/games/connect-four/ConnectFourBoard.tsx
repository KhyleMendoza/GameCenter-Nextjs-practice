'use client';

import { ConnectFourBoard as BoardType } from '@/lib/gameLogic';
import ConnectFourCell from './ConnectFourCell';

interface ConnectFourBoardProps {
  board: BoardType;
  onColumnClick: (col: number) => void;
  disabled: boolean;
  winningCells?: { row: number; col: number }[];
}

export default function ConnectFourBoard({ 
  board, 
  onColumnClick, 
  disabled,
  winningCells = []
}: ConnectFourBoardProps) {
  const isWinningCell = (row: number, col: number) => {
    return winningCells.some(cell => cell.row === row && cell.col === col);
  };

  return (
    <div className="bg-blue-600 p-4 rounded-2xl shadow-2xl">
      {/* Column indicators */}
      <div className="flex justify-center mb-2">
        {Array.from({ length: 7 }, (_, col) => (
          <div key={col} className="w-16 h-8 mx-1 flex items-center justify-center">
            <div className="text-white font-bold text-lg opacity-60">
              {col + 1}
            </div>
          </div>
        ))}
      </div>
      
      {/* Game board */}
      <div className="grid grid-rows-6 gap-1">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center">
            {row.map((cell, colIndex) => (
              <ConnectFourCell
                key={`${rowIndex}-${colIndex}`}
                player={cell}
                onClick={() => !disabled && onColumnClick(colIndex)}
                isWinningCell={isWinningCell(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>
      
      {/* Drop zone indicators */}
      {!disabled && (
        <div className="flex justify-center mt-2">
          {Array.from({ length: 7 }, (_, col) => (
            <button
              key={col}
              onClick={() => onColumnClick(col)}
              className="w-16 h-4 mx-1 bg-blue-400 hover:bg-blue-300 rounded-b-lg transition-colors opacity-70 hover:opacity-100"
              disabled={disabled || board[0][col] !== null}
            >
              <div className="text-white text-xs">▼</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
