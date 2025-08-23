'use client';

import { useState, useEffect } from 'react';
import { Board, Player, GameMode, Difficulty, checkWinner, isBoardFull, makeBotMove } from '@/lib/gameLogic';
import BoardComponent from './Board';
import GameInfo from './GameInfo';

export default function TicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameMode, setGameMode] = useState<GameMode>('bot');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [winner, setWinner] = useState<Player | null>(null);
  const [isDraw, setIsDraw] = useState(false);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setIsDraw(false);
  };

  const handleCellClick = (index: number) => {
    if (board[index] || winner || isDraw) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
      return;
    }

    if (isBoardFull(newBoard)) {
      setIsDraw(true);
      return;
    }

    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  useEffect(() => {
    if (gameMode === 'bot' && currentPlayer === 'O' && !winner && !isDraw) {
      const timer = setTimeout(() => {
        const botMove = makeBotMove(board, 'O', difficulty);
        if (botMove !== -1) {
          handleCellClick(botMove);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentPlayer, board, gameMode, difficulty, winner, isDraw]);

  const switchGameMode = (mode: GameMode) => {
    setGameMode(mode);
    resetGame();
  };

  const switchDifficulty = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    resetGame();
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-96">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Tic Tac Toe
        </h1>
        
        <GameInfo 
          currentPlayer={currentPlayer}
          winner={winner}
          isDraw={isDraw}
          gameMode={gameMode}
          difficulty={difficulty}
          onModeSwitch={switchGameMode}
          onDifficultySwitch={switchDifficulty}
          onReset={resetGame}
        />
        
        <BoardComponent 
          board={board}
          onCellClick={handleCellClick}
          winner={winner}
        />
      </div>
    </div>
  );
}
