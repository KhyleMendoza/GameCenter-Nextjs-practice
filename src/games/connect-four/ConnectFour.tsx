'use client';

import { useState, useEffect } from 'react';
import {
  ConnectFourBoard as BoardType,
  ConnectFourPlayer,
  ConnectFourGameMode,
  ConnectFourDifficulty,
  createConnectFourBoard,
  dropToken,
  checkConnectFourWinner,
  isConnectFourBoardFull,
  makeConnectFourBotMove
} from '@/lib/gameLogic';
import ConnectFourBoard from './ConnectFourBoard';
import ConnectFourGameInfo from './ConnectFourGameInfo';

export default function ConnectFour() {
  const [board, setBoard] = useState<BoardType>(createConnectFourBoard());
  const [currentPlayer, setCurrentPlayer] = useState<ConnectFourPlayer>('red');
  const [winner, setWinner] = useState<ConnectFourPlayer | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [gameMode, setGameMode] = useState<ConnectFourGameMode>('bot');
  const [difficulty, setDifficulty] = useState<ConnectFourDifficulty>('medium');
  const [moveCount, setMoveCount] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const [winningCells, setWinningCells] = useState<{ row: number; col: number }[]>([]);

  const resetGame = () => {
    setBoard(createConnectFourBoard());
    setCurrentPlayer('red');
    setWinner(null);
    setIsDraw(false);
    setMoveCount(0);
    setIsThinking(false);
    setWinningCells([]);
  };

  const handleModeChange = (mode: ConnectFourGameMode) => {
    setGameMode(mode);
    resetGame();
  };

  const handleDifficultyChange = (newDifficulty: ConnectFourDifficulty) => {
    setDifficulty(newDifficulty);
  };

  const findWinningCells = (board: BoardType, winner: ConnectFourPlayer): { row: number; col: number }[] => {
    const rows = 6;
    const cols = 7;

    // Check horizontal
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols - 3; col++) {
        if (board[row][col] === winner && 
            board[row][col + 1] === winner && 
            board[row][col + 2] === winner && 
            board[row][col + 3] === winner) {
          return [
            { row, col },
            { row, col: col + 1 },
            { row, col: col + 2 },
            { row, col: col + 3 }
          ];
        }
      }
    }

    // Check vertical
    for (let row = 0; row < rows - 3; row++) {
      for (let col = 0; col < cols; col++) {
        if (board[row][col] === winner && 
            board[row + 1][col] === winner && 
            board[row + 2][col] === winner && 
            board[row + 3][col] === winner) {
          return [
            { row, col },
            { row: row + 1, col },
            { row: row + 2, col },
            { row: row + 3, col }
          ];
        }
      }
    }

    // Check diagonal (top-left to bottom-right)
    for (let row = 0; row < rows - 3; row++) {
      for (let col = 0; col < cols - 3; col++) {
        if (board[row][col] === winner && 
            board[row + 1][col + 1] === winner && 
            board[row + 2][col + 2] === winner && 
            board[row + 3][col + 3] === winner) {
          return [
            { row, col },
            { row: row + 1, col: col + 1 },
            { row: row + 2, col: col + 2 },
            { row: row + 3, col: col + 3 }
          ];
        }
      }
    }

    // Check diagonal (top-right to bottom-left)
    for (let row = 0; row < rows - 3; row++) {
      for (let col = 3; col < cols; col++) {
        if (board[row][col] === winner && 
            board[row + 1][col - 1] === winner && 
            board[row + 2][col - 2] === winner && 
            board[row + 3][col - 3] === winner) {
          return [
            { row, col },
            { row: row + 1, col: col - 1 },
            { row: row + 2, col: col - 2 },
            { row: row + 3, col: col - 3 }
          ];
        }
      }
    }

    return [];
  };

  const handleColumnClick = (col: number) => {
    if (winner || isDraw || isThinking) return;

    const newBoard = dropToken(board, col, currentPlayer);
    if (!newBoard) return; // Invalid move

    setBoard(newBoard);
    setMoveCount(moveCount + 1);

    const gameWinner = checkConnectFourWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setWinningCells(findWinningCells(newBoard, gameWinner));
      return;
    }

    if (isConnectFourBoardFull(newBoard)) {
      setIsDraw(true);
      return;
    }

    // Switch to next player
    const nextPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
    setCurrentPlayer(nextPlayer);
  };

  // Bot move effect
  useEffect(() => {
    if (gameMode === 'bot' && currentPlayer === 'yellow' && !winner && !isDraw) {
      setIsThinking(true);
      
      const timer = setTimeout(() => {
        const botMove = makeConnectFourBotMove(board, 'yellow', difficulty);
        if (botMove !== -1) {
          const newBoard = dropToken(board, botMove, 'yellow');
          if (newBoard) {
            setBoard(newBoard);
            setMoveCount(prev => prev + 1);

            const gameWinner = checkConnectFourWinner(newBoard);
            if (gameWinner) {
              setWinner(gameWinner);
              setWinningCells(findWinningCells(newBoard, gameWinner));
            } else if (isConnectFourBoardFull(newBoard)) {
              setIsDraw(true);
            } else {
              setCurrentPlayer('red');
            }
          }
        }
        setIsThinking(false);
      }, 300); // Quick response for better UX

      return () => clearTimeout(timer);
    }
  }, [board, currentPlayer, gameMode, winner, isDraw, difficulty, moveCount]);

  const isGameDisabled = winner !== null || isDraw || isThinking;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        {/* Game Board */}
        <div className="flex-1 flex justify-center">
          <div className="relative">
            <ConnectFourBoard
              board={board}
              onColumnClick={handleColumnClick}
              disabled={isGameDisabled}
              winningCells={winningCells}
            />

          </div>
        </div>

        {/* Game Info Panel */}
        <div className="flex-shrink-0">
          <ConnectFourGameInfo
            currentPlayer={currentPlayer}
            winner={winner}
            isDraw={isDraw}
            gameMode={gameMode}
            difficulty={difficulty}
            onRestart={resetGame}
            onModeChange={handleModeChange}
            onDifficultyChange={handleDifficultyChange}
            moveCount={moveCount}
          />
        </div>
      </div>
    </div>
  );
}
