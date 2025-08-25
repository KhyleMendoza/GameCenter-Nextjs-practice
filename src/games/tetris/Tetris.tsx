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
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const dropTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

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
      const testPiece = { ...prevState.currentPiece };

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
    setShowGameOverModal(false);
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState.gameOver) return;

      switch (event.key.toLowerCase()) {
        case 'arrowleft':
        case 'a':
          event.preventDefault();
          movePiece(-1, 0);
          break;
        case 'arrowright':
        case 'd':
          event.preventDefault();
          movePiece(1, 0);
          break;
        case 'arrowdown':
        case 's':
          event.preventDefault();
          movePiece(0, 1);
          break;
        case 'arrowup':
        case 'w':
          event.preventDefault();
          rotatePieceHandler();
          break;
        case ' ':
          event.preventDefault();
          hardDrop();
          break;
        case 'p':
          event.preventDefault();
          togglePause();
          break;
        case 'r':
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

  useEffect(() => {
    if (gameState.gameOver) {
      setTimeout(() => setShowGameOverModal(true), 500);
    }
  }, [gameState.gameOver]);

  const displayBoard = getBoardWithPiece(gameState.board, gameState.currentPiece);

  return (
    <div className="flex items-center justify-center p-4 min-h-screen">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-6xl w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Tetris
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="order-2 lg:order-1 flex flex-col gap-4">
            <TetrisPreview 
              nextPiece={gameState.nextPiece}
              title="Next Piece"
            />
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-bold text-gray-800 mb-3 text-lg">🎮 Controls</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-white px-2 py-1 rounded font-mono text-xs">←→</span>
                    <span className="text-gray-500 text-xs">or</span>
                    <span className="bg-white px-2 py-1 rounded font-mono text-xs">AD</span>
                  </div>
                  <span>Move</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-white px-2 py-1 rounded font-mono text-xs">↓</span>
                    <span className="text-gray-500 text-xs">or</span>
                    <span className="bg-white px-2 py-1 rounded font-mono text-xs">S</span>
                  </div>
                  <span>Soft Drop</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-white px-2 py-1 rounded font-mono text-xs">↑</span>
                    <span className="text-gray-500 text-xs">or</span>
                    <span className="bg-white px-2 py-1 rounded font-mono text-xs">W</span>
                  </div>
                  <span>Rotate</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-white px-2 py-1 rounded font-mono text-xs">Space</span>
                  <span>Hard Drop</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-white px-2 py-1 rounded font-mono text-xs">P</span>
                  <span>Pause</span>
                </div>
                {gameState.gameOver && (
                  <div className="flex items-center gap-2">
                    <span className="bg-white px-2 py-1 rounded font-mono text-xs">R</span>
                    <span>Restart</span>
                  </div>
                )}
              </div>
            </div>

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

          <div className="order-1 lg:order-2 flex justify-center">
            <TetrisBoard 
              board={displayBoard} 
              gameOver={gameState.gameOver}
              paused={gameState.paused}
            />
          </div>
          
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
        
        {gameState.paused && !gameState.gameOver && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
              <div className="bg-yellow-500 text-white p-6 text-center">
                <div className="text-6xl mb-4">⏸️</div>
                <h2 className="text-2xl font-bold">Game Paused</h2>
              </div>
              <div className="p-6 text-center">
                <p className="text-gray-700 text-lg mb-6">Press P to continue playing</p>
                <div className="flex gap-3">
                  <button
                    onClick={togglePause}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    ▶️ Resume
                  </button>
                  <button
                    onClick={resetGame}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    🔄 Restart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showGameOverModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
              <div className="bg-red-500 text-white p-6 text-center">
                <div className="text-6xl mb-4">🎮</div>
                <h2 className="text-2xl font-bold">Game Over!</h2>
              </div>
              <div className="p-6 text-center">
                <p className="text-gray-700 text-lg mb-2">Final Score: <span className="font-bold text-blue-600">{gameState.score.toLocaleString()}</span></p>
                <p className="text-gray-700 text-lg mb-6">Lines Cleared: <span className="font-bold text-green-600">{gameState.lines}</span></p>
                <div className="text-2xl mb-4 text-gray-400">🎉</div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      resetGame();
                      setShowGameOverModal(false);
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    🔄 New Game
                  </button>
                  <button
                    onClick={() => setShowGameOverModal(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    ✕ Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

