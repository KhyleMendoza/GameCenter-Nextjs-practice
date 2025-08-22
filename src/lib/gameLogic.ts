export type Player = 'X' | 'O';
export type Board = (Player | null)[];
export type GameMode = 'bot' | '1v1';

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

export const makeBotMove = (board: Board, botPlayer: Player): number => {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return -1;

  const humanPlayer = botPlayer === 'X' ? 'O' : 'X';

  const findBestMove = (board: Board, depth: number, isMaximizing: boolean): number => {
    const winner = checkWinner(board);
    if (winner === botPlayer) return 10 - depth;
    if (winner === humanPlayer) return depth - 10;
    if (isBoardFull(board)) return 0;

    const availableMoves = getAvailableMoves(board);
    
    if (isMaximizing) {
      let bestScore = -Infinity;
      let bestMove = availableMoves[0];
      
      for (const move of availableMoves) {
        const newBoard = [...board];
        newBoard[move] = botPlayer;
        const score = findBestMove(newBoard, depth + 1, false);
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
      return bestMove;
    } else {
      let bestScore = Infinity;
      let bestMove = availableMoves[0];
      
      for (const move of availableMoves) {
        const newBoard = [...board];
        newBoard[move] = humanPlayer;
        const score = findBestMove(newBoard, depth + 1, true);
        if (score < bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
      return bestMove;
    }
  };

  return findBestMove(board, 0, true);
};
