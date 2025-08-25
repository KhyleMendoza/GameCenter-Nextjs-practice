'use client';

import { Piece, CellValue } from './tetrisLogic';

interface TetrisPreviewProps {
  nextPiece: Piece | null;
  title: string;
}

// Color mapping for different piece types (same as board)
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

export default function TetrisPreview({ nextPiece, title }: TetrisPreviewProps) {
  if (!nextPiece) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-bold text-gray-800 mb-3 text-lg">{title}</h3>
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-gray-200 rounded border-2 border-gray-300"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-bold text-gray-800 mb-3 text-lg">{title}</h3>
      <div className="flex justify-center">
        <div className="bg-gray-800 rounded border-2 border-gray-700 p-3">
          <div 
            className="grid gap-[1px]"
            style={{
              gridTemplateColumns: 'repeat(4, 1fr)',
              gridTemplateRows: 'repeat(4, 1fr)',
              width: '96px',
              height: '96px'
            }}
          >
          {nextPiece.shape.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${y}-${x}`}
                className={`
                  border transition-all duration-75
                  ${cell ? getCellColor(nextPiece.color) : 'bg-transparent border-transparent'}
                `}
                style={{
                  width: '22px',
                  height: '22px'
                }}
              />
            ))
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

