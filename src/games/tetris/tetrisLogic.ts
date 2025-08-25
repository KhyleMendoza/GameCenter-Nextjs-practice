// Tetris game logic and piece definitions

export type CellValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7; // 0 = empty, 1-7 = different piece types
export type Board = CellValue[][];
export type Position = { x: number; y: number };

export interface Piece {
  shape: number[][];
  color: CellValue;
  position: Position;
}

export interface GameState {
  board: Board;
  currentPiece: Piece | null;
  nextPiece: Piece | null;
  score: number;
  lines: number;
  level: number;
  gameOver: boolean;
  paused: boolean;
}

// Tetromino shapes (4x4 grids for easier rotation)
export const TETROMINOS: { [key: string]: { shape: number[][], color: CellValue } } = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: 1
  },
  O: {
    shape: [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    color: 2
  },
  T: {
    shape: [
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    color: 3
  },
  S: {
    shape: [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0]
    ],
    color: 4
  },
  Z: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    color: 5
  },
  J: {
    shape: [
      [0, 0, 0, 0],
      [1, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    color: 6
  },
  L: {
    shape: [
      [0, 0, 0, 0],
      [0, 0, 1, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    color: 7
  }
};

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

// Create empty board
export const createEmptyBoard = (): Board => {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));
};

// Get random tetromino
export const getRandomTetromino = (): Piece => {
  const pieces = Object.keys(TETROMINOS);
  const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
  const tetromino = TETROMINOS[randomPiece];
  
  return {
    shape: tetromino.shape,
    color: tetromino.color,
    position: { x: Math.floor(BOARD_WIDTH / 2) - 2, y: 0 }
  };
};

// Rotate piece 90 degrees clockwise
export const rotatePiece = (piece: Piece): Piece => {
  const rotated = piece.shape[0].map((_, index) =>
    piece.shape.map(row => row[index]).reverse()
  );
  
  return {
    ...piece,
    shape: rotated
  };
};

// Check if piece position is valid
export const isValidPosition = (board: Board, piece: Piece, offset: Position = { x: 0, y: 0 }): boolean => {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] !== 0) {
        const newX = piece.position.x + x + offset.x;
        const newY = piece.position.y + y + offset.y;
        
        // Check boundaries
        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return false;
        }
        
        // Check collision with existing pieces (but allow placing at top)
        if (newY >= 0 && board[newY][newX] !== 0) {
          return false;
        }
      }
    }
  }
  return true;
};

// Place piece on board
export const placePiece = (board: Board, piece: Piece): Board => {
  const newBoard = board.map(row => [...row]);
  
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] !== 0) {
        const boardY = piece.position.y + y;
        const boardX = piece.position.x + x;
        
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = piece.color;
        }
      }
    }
  }
  
  return newBoard;
};

// Check for completed lines and remove them
export const clearLines = (board: Board): { newBoard: Board; linesCleared: number } => {
  const newBoard = board.filter(row => row.some(cell => cell === 0));
  const linesCleared = BOARD_HEIGHT - newBoard.length;
  
  // Add empty rows at the top
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(0));
  }
  
  return { newBoard, linesCleared };
};

// Calculate score based on lines cleared and level
export const calculateScore = (linesCleared: number, level: number): number => {
  const basePoints = [0, 40, 100, 300, 1200]; // Points for 0, 1, 2, 3, 4 lines
  return basePoints[linesCleared] * (level + 1);
};

// Calculate level based on lines cleared
export const calculateLevel = (totalLines: number): number => {
  return Math.floor(totalLines / 10);
};

// Calculate drop speed based on level (milliseconds)
export const getDropSpeed = (level: number): number => {
  return Math.max(50, 1000 - (level * 50));
};

// Create initial game state
export const createInitialGameState = (): GameState => {
  return {
    board: createEmptyBoard(),
    currentPiece: getRandomTetromino(),
    nextPiece: getRandomTetromino(),
    score: 0,
    lines: 0,
    level: 0,
    gameOver: false,
    paused: false
  };
};

// Get board with current piece rendered
export const getBoardWithPiece = (board: Board, piece: Piece | null): Board => {
  if (!piece) return board;
  
  const boardWithPiece = board.map(row => [...row]);
  
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] !== 0) {
        const boardY = piece.position.y + y;
        const boardX = piece.position.x + x;
        
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          boardWithPiece[boardY][boardX] = piece.color;
        }
      }
    }
  }
  
  return boardWithPiece;
};

// Get ghost piece position (where piece would land if dropped)
export const getGhostPiece = (board: Board, piece: Piece): Piece => {
  let ghostPiece = { ...piece };
  
  while (isValidPosition(board, ghostPiece, { x: 0, y: 1 })) {
    ghostPiece = {
      ...ghostPiece,
      position: { ...ghostPiece.position, y: ghostPiece.position.y + 1 }
    };
  }
  
  return ghostPiece;
};

