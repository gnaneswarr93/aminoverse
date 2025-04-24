// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import ChatSidebar from '../components/ChatSidebar';
import ChatWindow from '../components/ChatWindow';
import HeroSection from '../components/HeroSection';
import { generateChatbotResponse } from '../api/chatbot';  // Correct import from chatbot.js
import {
  fetchUniProtData,
  fetchAlphaFoldStructure,
  fetchEntrezGeneData,
  fetchChEMBLData,
  fetchDisGeNETData,
  fetchStringDBData,
  fetchClinVarData,
  fetchMyGeneData,
  saveMessage,
  fetchHistory,
} from '../api';

export default function Home() {
  const { logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [proteinInfo, setProteinInfo] = useState(null);
  const [pdbUrl, setPdbUrl] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchHistory();
        setHistory(data || []);
      } catch (err) {
        console.error('Failed to load history:', err);
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: 'Failed to load chat history.' },
        ]);
      }
    };
    loadHistory();
  }, []);

  const handleSearch = async (query) => {
    if (!query) return;
  
    setMessages((prev) => [...prev, { sender: 'user', text: query }]);
  
    try {
      let responseText = '';
      let apiUsed = '';
  
      console.log('Starting search for:', query);
  
      // Attempt to find UniProt ID for the provided protein or gene name
      const uniProtData = await fetchUniProtData(query);
  
      if (uniProtData) {
        apiUsed = 'UniProt';
        setProteinInfo(uniProtData);  // Save the fetched protein data
        const funcText =
          uniProtData.comments?.find((c) => c.commentType === 'FUNCTION')?.texts?.[0]?.value ||
          'No function data available.';
        responseText = `UniProt Function: ${funcText}`;
  
        // Optionally, you can fetch AlphaFold structure here as well if needed
        try {
          const pdbLink = await fetchAlphaFoldStructure(uniProtData.primaryAccession);
          if (pdbLink) setPdbUrl(pdbLink);
        } catch (err) {
          console.warn('No AlphaFold structure available:', err);
        }
      } else {
        responseText = 'No UniProt data found.';
      }
  
      // Update the chat messages with the response
      setMessages((prev) => [...prev, { sender: 'bot', text: responseText }]);
      setHistory((prev) => [...prev, { prompt: query, response: responseText }]);
  
      // Optionally, save the message and response to the history (if needed)
      try {
        await saveMessage(query, responseText);
      } catch (err) {
        console.error('Failed to save message:', err);
      }
    } catch (err) {
      const errorMsg = 'Error fetching data. Please try again.';
      console.error('Search error:', err);
      setMessages((prev) => [...prev, { sender: 'bot', text: errorMsg }]);
      setHistory((prev) => [...prev, { prompt: query, response: errorMsg }]);
      try {
        await saveMessage(query, errorMsg);
      } catch (err) {
        console.error('Failed to save error message:', err);
      }
    }
  };
  
  

  const handleSend = async (userInput) => {
    if (!userInput) return;

    setMessages((prev) => [...prev, { sender: 'user', text: userInput }]);

    const botResponse = await generateChatbotResponse(userInput);  // Updated function call

    setMessages((prev) => [...prev, { sender: 'bot', text: botResponse }]);
    setHistory((prev) => [...prev, { prompt: userInput, response: botResponse }]);
    try {
      await saveMessage(userInput, botResponse);
    } catch (err) {
      console.error('Failed to save message:', err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans">
      <Navbar onLogout={logout} />
      <div className="flex flex-1 overflow-hidden">
        {isSidebarVisible && (
          <ChatSidebar history={history} onSelect={handleSearch} />
        )}
        <main className="flex-1 flex flex-col p-6 overflow-y-auto">
          <button
            className="self-end mb-4 text-neon hover:underline"
            onClick={() => setIsSidebarVisible((v) => !v)}
          >
            {isSidebarVisible ? 'Hide Sidebar' : 'Show Sidebar'}
          </button>
          <SearchBar onSearch={handleSearch} />
          {proteinInfo && pdbUrl && (
            <div className="mt-6">
              <HeroSection proteinInfo={proteinInfo} pdbUrl={pdbUrl} />
            </div>
          )}
          <div className="flex-1 mt-6 overflow-y-auto">
            <ChatWindow messages={messages} onSend={handleSend} />
          </div>
        </main>
      </div>
    </div>
  );
}
