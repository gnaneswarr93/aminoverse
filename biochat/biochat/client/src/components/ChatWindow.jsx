import React from 'react';
import StructureViewer from './StructureViewer';

function ChatWindow({ messages }) {
  return (
    <div className="h-96 overflow-y-auto border p-4 rounded bg-white">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`chat-bubble ${
            msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'
          }`}
        >
          <p>{msg.text}</p>
          {msg.structure && <StructureViewer pdbUrl={msg.structure} />}
        </div>
      ))}
    </div>
  );
}

export default ChatWindow;