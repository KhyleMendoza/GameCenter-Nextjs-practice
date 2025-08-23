export type Player = 'X' | 'O';
export type Board = (Player | null)[];
export type GameMode = 'bot' | '1v1';
export type Difficulty = 'easy' | 'medium' | 'hard';

// Connect 4 types
export type ConnectFourPlayer = 'red' | 'yellow';
export type ConnectFourBoard = (ConnectFourPlayer | null)[][];
export type ConnectFourGameMode = 'bot' | '1v1';
export type ConnectFourDifficulty = 'easy' | 'medium' | 'hard';

export const checkWinner = (board: Board): Player | null => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

export const isBoardFull = (board: Board): boolean => {
  return board.every(cell => cell !== null);
};

export const getAvailableMoves = (board: Board): number[] => {
  return board.map((cell, index) => cell === null ? index : -1).filter(index => index !== -1);
};

export const makeBotMove = (board: Board, botPlayer: Player, difficulty: Difficulty = 'hard'): number => {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return -1;

  const humanPlayer = botPlayer === 'X' ? 'O' : 'X';



  const findBestMoveScore = (board: Board, depth: number, isMaximizing: boolean): number => {
    const winner = checkWinner(board);
    if (winner === botPlayer) return 10 - depth;
    if (winner === humanPlayer) return depth - 10;
    if (isBoardFull(board)) return 0;

    const availableMoves = getAvailableMoves(board);
    
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (const move of availableMoves) {
        const newBoard = [...board];
        newBoard[move] = botPlayer;
        const score = findBestMoveScore(newBoard, depth + 1, false);
        if (score > bestScore) {
          bestScore = score;
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (const move of availableMoves) {
        const newBoard = [...board];
        newBoard[move] = humanPlayer;
        const score = findBestMoveScore(newBoard, depth + 1, true);
        if (score < bestScore) {
          bestScore = score;
        }
      }
      return bestScore;
    }
  };

  if (difficulty === 'easy') {
    const shouldPlaySmart = Math.random() < 0.3;
    if (shouldPlaySmart) {
      let bestScore = -Infinity;
      let bestMove = availableMoves[0];
      
      for (const move of availableMoves) {
        const newBoard = [...board];
        newBoard[move] = botPlayer;
        const score = findBestMoveScore(newBoard, 0, false);
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
      return bestMove;
    } else {
      const randomIndex = Math.floor(Math.random() * availableMoves.length);
      return availableMoves[randomIndex];
    }
  }

  if (difficulty === 'medium') {
    const shouldPlayPerfect = Math.random() < 0.7;
    if (shouldPlayPerfect) {
      let bestScore = -Infinity;
      let bestMove = availableMoves[0];
      
      for (const move of availableMoves) {
        const newBoard = [...board];
        newBoard[move] = botPlayer;
        const score = findBestMoveScore(newBoard, 0, false);
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
      return bestMove;
    } else {
      const randomIndex = Math.floor(Math.random() * availableMoves.length);
      return availableMoves[randomIndex];
    }
  }

  let bestScore = -Infinity;
  let bestMove = availableMoves[0];
  
  for (const move of availableMoves) {
    const newBoard = [...board];
    newBoard[move] = botPlayer;
    const score = findBestMoveScore(newBoard, 0, false);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  return bestMove;
};

// Connect 4 Game Logic
export const createConnectFourBoard = (): ConnectFourBoard => {
  return Array(6).fill(null).map(() => Array(7).fill(null));
};

export const dropToken = (board: ConnectFourBoard, col: number, player: ConnectFourPlayer): ConnectFourBoard | null => {
  // Check if column is valid and not full
  if (col < 0 || col >= 7 || board[0][col] !== null) {
    return null;
  }

  const newBoard = board.map(row => [...row]);
  
  // Find the lowest empty row in the column
  for (let row = 5; row >= 0; row--) {
    if (newBoard[row][col] === null) {
      newBoard[row][col] = player;
      return newBoard;
    }
  }
  
  return null;
};

export const checkConnectFourWinner = (board: ConnectFourBoard): ConnectFourPlayer | null => {
  const rows = 6;
  const cols = 7;

  // Check horizontal
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols - 3; col++) {
      const player = board[row][col];
      if (player && 
          player === board[row][col + 1] && 
          player === board[row][col + 2] && 
          player === board[row][col + 3]) {
        return player;
      }
    }
  }

  // Check vertical
  for (let row = 0; row < rows - 3; row++) {
    for (let col = 0; col < cols; col++) {
      const player = board[row][col];
      if (player && 
          player === board[row + 1][col] && 
          player === board[row + 2][col] && 
          player === board[row + 3][col]) {
        return player;
      }
    }
  }

  // Check diagonal (top-left to bottom-right)
  for (let row = 0; row < rows - 3; row++) {
    for (let col = 0; col < cols - 3; col++) {
      const player = board[row][col];
      if (player && 
          player === board[row + 1][col + 1] && 
          player === board[row + 2][col + 2] && 
          player === board[row + 3][col + 3]) {
        return player;
      }
    }
  }

  // Check diagonal (top-right to bottom-left)
  for (let row = 0; row < rows - 3; row++) {
    for (let col = 3; col < cols; col++) {
      const player = board[row][col];
      if (player && 
          player === board[row + 1][col - 1] && 
          player === board[row + 2][col - 2] && 
          player === board[row + 3][col - 3]) {
        return player;
      }
    }
  }

  return null;
};

export const isConnectFourBoardFull = (board: ConnectFourBoard): boolean => {
  return board[0].every(cell => cell !== null);
};

export const getAvailableConnectFourColumns = (board: ConnectFourBoard): number[] => {
  const availableColumns = [];
  for (let col = 0; col < 7; col++) {
    if (board[0][col] === null) {
      availableColumns.push(col);
    }
  }
  return availableColumns;
};

export const makeConnectFourBotMove = (
  board: ConnectFourBoard, 
  botPlayer: ConnectFourPlayer, 
  difficulty: ConnectFourDifficulty = 'hard'
): number => {
  const availableColumns = getAvailableConnectFourColumns(board);
  if (availableColumns.length === 0) return -1;

  const humanPlayer = botPlayer === 'red' ? 'yellow' : 'red';

  // Get search depth based on difficulty
  const depth = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 7;
  
  if (difficulty === 'easy') {
    // 40% chance to play random, 60% use minimax
    if (Math.random() < 0.4) {
      return availableColumns[Math.floor(Math.random() * availableColumns.length)];
    }
  }

  return getConnectFourMinimaxMove(board, botPlayer, humanPlayer, depth);
};

const getConnectFourMinimaxMove = (
  board: ConnectFourBoard,
  botPlayer: ConnectFourPlayer,
  humanPlayer: ConnectFourPlayer,
  maxDepth: number
): number => {
  const availableColumns = getAvailableConnectFourColumns(board);
  let bestMove = availableColumns[0];
  let bestScore = -Infinity;

  // First, check for immediate wins
  for (const col of availableColumns) {
    const testBoard = dropToken(board, col, botPlayer);
    if (testBoard && checkConnectFourWinner(testBoard) === botPlayer) {
      return col;
    }
  }

  // Then check for blocks
  for (const col of availableColumns) {
    const testBoard = dropToken(board, col, humanPlayer);
    if (testBoard && checkConnectFourWinner(testBoard) === humanPlayer) {
      return col;
    }
  }

  // Use minimax for best move
  for (const col of availableColumns) {
    const testBoard = dropToken(board, col, botPlayer);
    if (testBoard) {
      const score = minimax(testBoard, maxDepth - 1, false, botPlayer, humanPlayer, -Infinity, Infinity);
      if (score > bestScore) {
        bestScore = score;
        bestMove = col;
      }
    }
  }

  return bestMove;
};

const minimax = (
  board: ConnectFourBoard,
  depth: number,
  isMaximizing: boolean,
  botPlayer: ConnectFourPlayer,
  humanPlayer: ConnectFourPlayer,
  alpha: number,
  beta: number
): number => {
  const winner = checkConnectFourWinner(board);
  
  // Terminal states
  if (winner === botPlayer) return 1000 + depth;
  if (winner === humanPlayer) return -1000 - depth;
  if (isConnectFourBoardFull(board) || depth === 0) {
    return evaluateConnectFourBoard(board, botPlayer, humanPlayer);
  }

  const availableColumns = getAvailableConnectFourColumns(board);
  
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const col of availableColumns) {
      const testBoard = dropToken(board, col, botPlayer);
      if (testBoard) {
        const eval_ = minimax(testBoard, depth - 1, false, botPlayer, humanPlayer, alpha, beta);
        maxEval = Math.max(maxEval, eval_);
        alpha = Math.max(alpha, eval_);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const col of availableColumns) {
      const testBoard = dropToken(board, col, humanPlayer);
      if (testBoard) {
        const eval_ = minimax(testBoard, depth - 1, true, botPlayer, humanPlayer, alpha, beta);
        minEval = Math.min(minEval, eval_);
        beta = Math.min(beta, eval_);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
    }
    return minEval;
  }
};

const evaluateConnectFourBoard = (
  board: ConnectFourBoard,
  botPlayer: ConnectFourPlayer,
  humanPlayer: ConnectFourPlayer
): number => {
  let score = 0;
  
  // Score center column preference
  const centerCol = 3;
  for (let row = 0; row < 6; row++) {
    if (board[row][centerCol] === botPlayer) score += 3;
    else if (board[row][centerCol] === humanPlayer) score -= 3;
  }

  // Evaluate all possible 4-in-a-row windows
  score += evaluateWindows(board, botPlayer, humanPlayer);
  
  return score;
};

const evaluateWindows = (
  board: ConnectFourBoard,
  botPlayer: ConnectFourPlayer,
  humanPlayer: ConnectFourPlayer
): number => {
  let score = 0;
  
  // Horizontal windows
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      const window = [board[row][col], board[row][col + 1], board[row][col + 2], board[row][col + 3]];
      score += evaluateWindow(window, botPlayer, humanPlayer);
    }
  }
  
  // Vertical windows
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row < 3; row++) {
      const window = [board[row][col], board[row + 1][col], board[row + 2][col], board[row + 3][col]];
      score += evaluateWindow(window, botPlayer, humanPlayer);
    }
  }
  
  // Positive diagonal windows
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      const window = [board[row][col], board[row + 1][col + 1], board[row + 2][col + 2], board[row + 3][col + 3]];
      score += evaluateWindow(window, botPlayer, humanPlayer);
    }
  }
  
  // Negative diagonal windows
  for (let row = 3; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      const window = [board[row][col], board[row - 1][col + 1], board[row - 2][col + 2], board[row - 3][col + 3]];
      score += evaluateWindow(window, botPlayer, humanPlayer);
    }
  }
  
  return score;
};

const evaluateWindow = (
  window: (ConnectFourPlayer | null)[],
  botPlayer: ConnectFourPlayer,
  humanPlayer: ConnectFourPlayer
): number => {
  let score = 0;
  const botCount = window.filter(cell => cell === botPlayer).length;
  const humanCount = window.filter(cell => cell === humanPlayer).length;
  const emptyCount = window.filter(cell => cell === null).length;
  
  // Don't score windows that have both players
  if (botCount > 0 && humanCount > 0) return 0;
  
  if (botCount === 4) score += 100;
  else if (botCount === 3 && emptyCount === 1) score += 10;
  else if (botCount === 2 && emptyCount === 2) score += 2;
  
  if (humanCount === 4) score -= 100;
  else if (humanCount === 3 && emptyCount === 1) score -= 80; // Prioritize blocking
  else if (humanCount === 2 && emptyCount === 2) score -= 2;
  
  return score;
};
