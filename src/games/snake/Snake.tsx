'use client';

export default function Snake() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-96 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Snake Game
        </h1>
        <div className="text-gray-600 mb-6">
          <p className="text-lg mb-4">🐍 Coming Soon! 🐍</p>
          <p className="text-sm">
            Control the snake, eat food, and grow longer!
          </p>
        </div>
        <div className="bg-gray-200 rounded-lg p-8 mb-6">
          <div className="text-6xl text-gray-400 mb-4">🐍</div>
          <p className="text-gray-500">Game in development...</p>
        </div>
      </div>
    </div>
  );
}
