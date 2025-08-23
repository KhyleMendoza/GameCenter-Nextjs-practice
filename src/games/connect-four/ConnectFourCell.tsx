'use client';

import { ConnectFourPlayer } from '@/lib/gameLogic';

interface ConnectFourCellProps {
  player: ConnectFourPlayer | null;
  onClick: () => void;
  isWinningCell?: boolean;
}

export default function ConnectFourCell({ player, onClick, isWinningCell = false }: ConnectFourCellProps) {
  const getCellColor = () => {
    if (player === 'red') return 'bg-red-500';
    if (player === 'yellow') return 'bg-yellow-400';
    return 'bg-white';
  };

  const getCellShadow = () => {
    if (player === 'red') return 'shadow-red-300';
    if (player === 'yellow') return 'shadow-yellow-200';
    return 'shadow-gray-200';
  };

  return (
    <button
      onClick={onClick}
      className={`
        w-16 h-16 rounded-full border-2 border-blue-800 m-1 transition-all duration-200
        ${getCellColor()} ${getCellShadow()}
        ${player ? 'shadow-lg' : 'hover:bg-gray-100 hover:shadow-md cursor-pointer'}
        ${isWinningCell ? 'ring-4 ring-green-400 animate-pulse' : ''}
        disabled:cursor-not-allowed
      `}
      disabled={player !== null}
    >
      {player && (
        <div className={`w-full h-full rounded-full ${getCellColor()}`} />
      )}
    </button>
  );
}
