import React, { useState, useEffect, useRef } from 'react';
import ChatWindow from '../components/ChatWindow';
import { API_URL } from '../constants';

function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(Date.now().toString());

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');

    try {
      const response = await fetch(`${API_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input, sessionId }),
      });
      const data = await response.json();
      const botMessage = {
        sender: 'bot',
        text: data.response,
        structure: data.structure, // For 3D viewer
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { sender: 'bot', text: 'Error: Could not fetch data.' };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className="chat-container">
      <h1 className="text-2xl font-bold mb-4">Smart Bio Assistant</h1>
      <ChatWindow messages={messages} />
      <div className="flex mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 p-2 border rounded-l"
          placeholder="Ask about a protein or gene (e.g., BRCA1)..."
        />
        <button
          onClick={sendMessage}
          className="p-2 bg-blue-500 text-white rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Home;