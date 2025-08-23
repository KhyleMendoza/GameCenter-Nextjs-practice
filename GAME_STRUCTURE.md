# Game Center Structure

This document explains the structure for adding new games to the Game Center.

## Directory Structure

```
src/
├── components/
│   └── GameLauncher.tsx    # Main game selection interface
├── games/                  # All games are organized here
│   ├── tictactoe/         # Tic Tac Toe game
│   │   ├── TicTacToe.tsx  # Main game component
│   │   ├── Board.tsx      # Game board component
│   │   ├── Cell.tsx       # Individual cell component
│   │   └── GameInfo.tsx   # Game controls and info
│   ├── connect-four/      # Connect Four game (placeholder)
│   │   └── ConnectFour.tsx
│   └── snake/             # Snake game (placeholder)
│       └── Snake.tsx
└── lib/
    └── gameLogic.ts       # Shared game logic (currently tic-tac-toe specific)
```

## Adding a New Game

To add a new game, follow these steps:

1. **Create a new directory** in `src/games/` for your game
2. **Create the main game component** (e.g., `MyGame.tsx`)
3. **Update the GameLauncher** to include your new game:

```typescript
// In GameLauncher.tsx
import MyGame from '@/games/my-game/MyGame';

// Add to GameType
export type GameType = 'tictactoe' | 'connect-four' | 'snake' | 'my-game';

// Add to games array
const games: Game[] = [
  // ... existing games
  {
    id: 'my-game',
    name: 'My Game',
    description: 'Description of my game',
    icon: '🎮',
    available: true, // Set to false for coming soon
    component: MyGame
  }
];
```

## Game Component Structure

Each game should follow this basic structure:

```typescript
'use client';

export default function MyGame() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-96">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          My Game
        </h1>
        {/* Your game content here */}
      </div>
    </div>
  );
}
```

## Features

- **Game Selection Interface**: Clean, responsive grid layout
- **Coming Soon Games**: Placeholder system for future games
- **Consistent Styling**: All games use the same design system
- **Easy Navigation**: Back button to return to game selection
- **Scalable**: Easy to add new games without modifying existing code

## Current Games

1. **Tic Tac Toe** ✅ Available
   - AI opponent with 3 difficulty levels
   - 1v1 mode
   - Full game logic implementation

2. **Connect Four** 🚧 Coming Soon
   - Placeholder component ready

3. **Snake Game** 🚧 Coming Soon
   - Placeholder component ready
