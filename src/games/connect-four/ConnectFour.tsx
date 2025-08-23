'use client';

export default function ConnectFour() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-96 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Connect Four
        </h1>
        <div className="text-gray-600 mb-6">
          <p className="text-lg mb-4">🔴 Coming Soon! 🔴</p>
          <p className="text-sm">
            Drop your tokens and connect four in a row to win!
          </p>
        </div>
        <div className="bg-gray-200 rounded-lg p-8 mb-6">
          <div className="text-6xl text-gray-400 mb-4">🔴</div>
          <p className="text-gray-500">Game in development...</p>
        </div>
      </div>
    </div>
  );
}
