import { Board as BoardType, Player } from '@/lib/gameLogic';
import Cell from './Cell';

interface BoardProps {
  board: BoardType;
  onCellClick: (index: number) => void;
  winner: Player | null;
}

export default function BoardComponent({ board, onCellClick, winner }: BoardProps) {
  return (
    <div className="grid grid-cols-3 gap-2 w-80 h-80 mx-auto">
      {board.map((value, index) => (
        <div key={index} className="aspect-square">
          <Cell
            value={value}
            onClick={() => onCellClick(index)}
            disabled={!!winner}
          />
        </div>
      ))}
    </div>
  );
}
