import React from 'react';

export default function ChatSidebar({ history, onSelect }) {
  return (
    <aside className="w-80 bg-gray-900 text-white p-4 overflow-y-auto border-r border-gray-700 h-full">
      <h3 className="text-xl font-bold mb-4">Chat History</h3>
      <div className="space-y-2">
        {history.length === 0 ? (
          <p className="text-gray-400">No history yet.</p>
        ) : (
          history.map((item, i) => (
            <button
              key={i}
              onClick={() => onSelect(item.prompt)}
              className="w-full text-left p-2 rounded hover:bg-gray-700 transition"
            >
              <div className="text-sm truncate">{item.prompt}</div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}