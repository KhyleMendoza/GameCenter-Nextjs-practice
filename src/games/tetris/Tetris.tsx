'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import TetrisBoard from './TetrisBoard';
import TetrisPreview from './TetrisPreview';
import TetrisControls from './TetrisControls';
import {
  GameState,
  createInitialGameState,
  isValidPosition,
  placePiece,
  clearLines,
  calculateScore,
  calculateLevel,
  getDropSpeed,
  getRandomTetromino,
  rotatePiece,
  getBoardWithPiece
} from './tetrisLogic';

export default function Tetris() {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [lastDrop, setLastDrop] = useState<number>(Date.now());
  const gameLoopRef = useRef<number>();
  const dropTimerRef = useRef<NodeJS.Timeout>();

  // Move piece
  const movePiece = useCallback((deltaX: number, deltaY: number) => {
    setGameState(prevState => {
      if (!prevState.currentPiece || prevState.gameOver || prevState.paused) {
        return prevState;
      }

      const newPosition = {
        x: prevState.currentPiece.position.x + deltaX,
        y: prevState.currentPiece.position.y + deltaY
      };

      const newPiece = {
        ...prevState.currentPiece,
        position: newPosition
      };

      if (isValidPosition(prevState.board, newPiece)) {
        return {
          ...prevState,
          currentPiece: newPiece
        };
      }

      return prevState;
    });
  }, []);

  // Rotate piece
  const rotatePieceHandler = useCallback(() => {
    setGameState(prevState => {
      if (!prevState.currentPiece || prevState.gameOver || prevState.paused) {
        return prevState;
      }

      const rotatedPiece = rotatePiece(prevState.currentPiece);

      if (isValidPosition(prevState.board, rotatedPiece)) {
        return {
          ...prevState,
          currentPiece: rotatedPiece
        };
      }

      return prevState;
    });
  }, []);

  // Drop piece
  const dropPiece = useCallback(() => {
    setGameState(prevState => {
      if (!prevState.currentPiece || prevState.gameOver || prevState.paused) {
        return prevState;
      }

      // Try to move piece down
      const newPosition = {
        x: prevState.currentPiece.position.x,
        y: prevState.currentPiece.position.y + 1
      };

      const newPiece = {
        ...prevState.currentPiece,
        position: newPosition
      };

      if (isValidPosition(prevState.board, newPiece)) {
        return {
          ...prevState,
          currentPiece: newPiece
        };
      }

      // Can't move down, place the piece
      const newBoard = placePiece(prevState.board, prevState.currentPiece);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      
      const newLines = prevState.lines + linesCleared;
      const newLevel = calculateLevel(newLines);
      const newScore = prevState.score + calculateScore(linesCleared, prevState.level);

      // Check if game is over (new piece can't be placed)
      const nextPiece = prevState.nextPiece || getRandomTetromino();
      const gameOver = !isValidPosition(clearedBoard, nextPiece);

      return {
        ...prevState,
        board: clearedBoard,
        currentPiece: gameOver ? null : nextPiece,
        nextPiece: gameOver ? null : getRandomTetromino(),
        score: newScore,
        lines: newLines,
        level: newLevel,
        gameOver
      };
    });
  }, []);

  // Hard drop
  const hardDrop = useCallback(() => {
    setGameState(prevState => {
      if (!prevState.currentPiece || prevState.gameOver || prevState.paused) {
        return prevState;
      }

      let dropDistance = 0;
      let testPiece = { ...prevState.currentPiece };

      // Find how far the piece can drop
      while (isValidPosition(prevState.board, {
        ...testPiece,
        position: { ...testPiece.position, y: testPiece.position.y + 1 }
      })) {
        testPiece.position.y += 1;
        dropDistance += 1;
      }

      // Place the piece immediately
      const newBoard = placePiece(prevState.board, testPiece);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      
      const newLines = prevState.lines + linesCleared;
      const newLevel = calculateLevel(newLines);
      const newScore = prevState.score + calculateScore(linesCleared, prevState.level) + dropDistance * 2; // Bonus for hard drop

      // Check if game is over
      const nextPiece = prevState.nextPiece || getRandomTetromino();
      const gameOver = !isValidPosition(clearedBoard, nextPiece);

      return {
        ...prevState,
        board: clearedBoard,
        currentPiece: gameOver ? null : nextPiece,
        nextPiece: gameOver ? null : getRandomTetromino(),
        score: newScore,
        lines: newLines,
        level: newLevel,
        gameOver
      };
    });
  }, []);

  // Toggle pause
  const togglePause = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      paused: !prevState.paused
    }));
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    setGameState(createInitialGameState());
    setLastDrop(Date.now());
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState.gameOver) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
          event.preventDefault();
          movePiece(1, 0);
          break;
        case 'ArrowDown':
          event.preventDefault();
          movePiece(0, 1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          rotatePieceHandler();
          break;
        case ' ': // Spacebar for hard drop
          event.preventDefault();
          hardDrop();
          break;
        case 'p':
        case 'P':
          event.preventDefault();
          togglePause();
          break;
        case 'r':
        case 'R':
          if (gameState.gameOver) {
            event.preventDefault();
            resetGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.gameOver, movePiece, rotatePieceHandler, hardDrop, togglePause, resetGame]);

  // Game loop for automatic piece dropping
  useEffect(() => {
    if (gameState.gameOver || gameState.paused) {
      if (dropTimerRef.current) {
        clearInterval(dropTimerRef.current);
      }
      return;
    }

    const dropSpeed = getDropSpeed(gameState.level);
    
    dropTimerRef.current = setInterval(() => {
      dropPiece();
    }, dropSpeed);

    return () => {
      if (dropTimerRef.current) {
        clearInterval(dropTimerRef.current);
      }
    };
  }, [gameState.level, gameState.gameOver, gameState.paused, dropPiece]);

  // Get display board
  const displayBoard = getBoardWithPiece(gameState.board, gameState.currentPiece);

  return (
    <div className="flex items-center justify-center p-4 min-h-screen">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-6xl w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Tetris
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Column 1: Next Piece & Tips */}
          <div className="order-2 lg:order-1 flex flex-col gap-4">
            {/* Next Piece */}
            <TetrisPreview 
              nextPiece={gameState.nextPiece}
              title="Next Piece"
            />
            
            {/* Controls Help */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-bold text-gray-800 mb-3 text-lg">🎮 Controls</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="bg-white px-2 py-1 rounded font-mono text-xs min-w-[50px] text-center">←→</span>
                  <span>Move</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-white px-2 py-1 rounded font-mono text-xs min-w-[50px] text-center">↓</span>
                  <span>Soft Drop</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-white px-2 py-1 rounded font-mono text-xs min-w-[50px] text-center">↑</span>
                  <span>Rotate</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-white px-2 py-1 rounded font-mono text-xs min-w-[50px] text-center">Space</span>
                  <span>Hard Drop</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-white px-2 py-1 rounded font-mono text-xs min-w-[50px] text-center">P</span>
                  <span>Pause</span>
                </div>
                {gameState.gameOver && (
                  <div className="flex items-center gap-2">
                    <span className="bg-white px-2 py-1 rounded font-mono text-xs min-w-[50px] text-center">R</span>
                    <span>Restart</span>
                  </div>
                )}
              </div>
            </div>

            {/* Game Tips */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-bold text-blue-800 mb-3 text-lg">💡 Pro Tips</h4>
              <div className="text-sm text-blue-700 space-y-2">
                <div>• Clear 4 lines at once (Tetris) for maximum points</div>
                <div>• Use T-spins for advanced scoring</div>
                <div>• Keep the stack low and even</div>
                <div>• Plan 2-3 pieces ahead</div>
                <div>• Use hold piece strategically</div>
              </div>
            </div>
          </div>

          {/* Column 2: Game Board */}
          <div className="order-1 lg:order-2 flex justify-center">
            <TetrisBoard 
              board={displayBoard} 
              gameOver={gameState.gameOver}
              paused={gameState.paused}
            />
          </div>
          
          {/* Column 3: Game Stats & Controls */}
          <div className="order-3 lg:order-3 flex flex-col gap-4">
            <TetrisControls 
              score={gameState.score}
              lines={gameState.lines}
              level={gameState.level}
              gameOver={gameState.gameOver}
              paused={gameState.paused}
              onPause={togglePause}
              onReset={resetGame}
            />

            {/* Additional Stats */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-bold text-gray-800 mb-3 text-lg">📊 Performance</h3>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {gameState.lines > 0 ? Math.round(gameState.score / gameState.lines) : 0}
                    </div>
                    <div className="text-sm text-gray-600">Points per Line</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.floor(gameState.level * 1.2 + 1)}x
                    </div>
                    <div className="text-sm text-gray-600">Drop Speed</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {gameState.level + 1}
                    </div>
                    <div className="text-sm text-gray-600">Difficulty</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Game Over Notification */}
        {gameState.gameOver && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-white rounded-xl p-6 shadow-2xl border-4 border-red-500 animate-pulse">
              <h2 className="text-2xl font-bold text-red-600 mb-3 text-center">🎮 Game Over!</h2>
              <div className="text-center mb-4">
                <p className="text-lg text-gray-700 mb-1">Final Score: <span className="font-bold text-blue-600">{gameState.score.toLocaleString()}</span></p>
                <p className="text-md text-gray-600">Lines Cleared: <span className="font-bold text-green-600">{gameState.lines}</span></p>
              </div>
              <button
                onClick={resetGame}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                🔄 Play Again
              </button>
            </div>
          </div>
        )}
        
        {/* Pause Notification */}
        {gameState.paused && !gameState.gameOver && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40">
            <div className="bg-white rounded-xl p-6 shadow-2xl border-4 border-yellow-500">
              <h2 className="text-2xl font-bold text-yellow-600 mb-3 text-center">⏸️ Paused</h2>
              <p className="text-md text-gray-600 mb-4 text-center">Press P to continue</p>
              <button
                onClick={togglePause}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                ▶️ Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

