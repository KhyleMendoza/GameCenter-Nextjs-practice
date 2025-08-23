import { Player } from '@/lib/gameLogic';

interface CellProps {
  value: Player | null;
  onClick: () => void;
  disabled: boolean;
}

export default function Cell({ value, onClick, disabled }: CellProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || !!value}
      className={`
        w-full h-full bg-white border-2 border-gray-300 rounded-lg
        text-5xl font-bold transition-all duration-200
        hover:bg-gray-50 hover:border-blue-400 hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-60
        flex items-center justify-center
        overflow-hidden
        ${value === 'X' ? 'text-blue-600' : ''}
        ${value === 'O' ? 'text-red-600' : ''}
        ${!value && !disabled ? 'text-gray-400' : ''}
      `}
    >
      <div className="w-full h-full flex items-center justify-center text-center">
        {value}
      </div>
    </button>
  );
}
