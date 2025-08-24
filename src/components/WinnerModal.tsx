'use client';

import { useEffect } from 'react';

interface WinnerModalProps {
  isOpen: boolean;
  winner: string | null;
  isDraw: boolean;
  onNewGame: () => void;
  onClose: () => void;
  gameType: 'tictactoe' | 'connect4';
}

export default function WinnerModal({ 
  isOpen, 
  winner, 
  isDraw, 
  onNewGame, 
  onClose, 
  gameType 
}: WinnerModalProps) {
  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

         if (isOpen) {
       document.addEventListener('keydown', handleEscape);
     }

         return () => {
       document.removeEventListener('keydown', handleEscape);
     };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getWinnerDisplay = () => {
    if (isDraw) {
      return {
        title: "It's a Draw!",
        icon: "🤝",
        message: "Great game! Nobody wins this time.",
        bgColor: "bg-yellow-500"
      };
    }

    if (gameType === 'tictactoe') {
      return {
        title: `Player ${winner} Wins!`,
        icon: winner === 'X' ? '❌' : '⭕',
        message: `Congratulations! Player ${winner} is the winner!`,
        bgColor: winner === 'X' ? 'bg-blue-500' : 'bg-red-500'
      };
    }

    // Connect 4
    const playerName = winner === 'red' ? 'Red' : 'Yellow';
    return {
      title: `${playerName} Wins!`,
      icon: winner === 'red' ? '🔴' : '🟡',
      message: `Congratulations! ${playerName} player is the winner!`,
      bgColor: winner === 'red' ? 'bg-red-500' : 'bg-yellow-500'
    };
  };

  const { title, icon, message, bgColor } = getWinnerDisplay();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header with colored background */}
        <div className={`${bgColor} text-white p-6 text-center`}>
          <div className="text-6xl mb-4">{icon}</div>
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <p className="text-gray-700 text-lg mb-6">{message}</p>
          
                     {/* Simple celebration */}
           {!isDraw && (
             <div className="text-2xl mb-4 text-gray-400">
               🎉
             </div>
           )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={onNewGame}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              🔄 New Game
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              ✕ Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
