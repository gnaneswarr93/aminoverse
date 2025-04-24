import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import ChatSidebar from '../components/ChatSidebar';
import ChatWindow from '../components/ChatWindow';
import HeroSection from '../components/HeroSection';
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

      if (query.match(/^[OPQ][0-9][A-Z0-9]{3}[0-9]$/i)) {
        apiUsed = 'UniProt';
        console.log('Fetching UniProt data...');
        const data = await fetchUniProtData(query);
        if (data) {
          setProteinInfo(data);
          const funcText =
            data.comments?.find((c) => c.commentType === 'FUNCTION')?.texts?.[0]
              ?.value || 'No function data available.';
          responseText = `UniProt Function: ${funcText}`;
          try {
            console.log('Fetching AlphaFold structure...');
            const pdbLink = await fetchAlphaFoldStructure(data.primaryAccession);
            if (pdbLink) setPdbUrl(pdbLink);
          } catch (err) {
            console.warn('No AlphaFold structure available:', err);
          }
        } else {
          responseText = 'No UniProt data found.';
        }
      } else if (query.match(/^rs[0-9]+$/i)) {
        apiUsed = 'ClinVar';
        console.log('Fetching ClinVar data...');
        const data = await fetchClinVarData(query);
        responseText = data
          ? `ClinVar: Clinical significance - ${data.clinical_significance || 'Unknown'}`
          : 'No ClinVar data found.';
      } else if (query.match(/^[0-9]+$/)) {
        apiUsed = 'NCBI Entrez';
        console.log('Fetching NCBI Entrez data...');
        const data = await fetchEntrezGeneData(query);
        responseText = data
          ? `NCBI Entrez: ${data.summary || 'No summary available.'}`
          : 'No Entrez Gene data found.';
      } else {
        console.log('Fetching multiple APIs...');
        const [uniprotData, myGeneData, disgenetData, stringData] =
          await Promise.allSettled([
            fetchUniProtData(query).then((res) => {
              console.log('UniProt API result:', res);
              return res;
            }),
            fetchMyGeneData(query).then((res) => {
              console.log('MyGene API result:', res);
              return res;
            }),
            fetchDisGeNETData(query).then((res) => {
              console.log('DisGeNET API result:', res);
              return res;
            }),
            fetchStringDBData(query).then((res) => {
              console.log('STRING-DB API result:', res);
              return res;
            }),
          ]);

        if (uniprotData.status === 'fulfilled' && uniprotData.value) {
          apiUsed = 'UniProt';
          setProteinInfo(uniprotData.value);
          const funcText =
            uniprotData.value.comments?.find(
              (c) => c.commentType === 'FUNCTION'
            )?.texts?.[0]?.value || 'No function data available.';
          responseText = `UniProt Function: ${funcText}`;
          try {
            console.log('Fetching AlphaFold structure for UniProt...');
            const pdbLink = await fetchAlphaFoldStructure(
              uniprotData.value.primaryAccession
            );
            if (pdbLink) setPdbUrl(pdbLink);
          } catch (err) {
            console.warn('No AlphaFold structure available:', err);
          }
        } else if (myGeneData.status === 'fulfilled' && myGeneData.value) {
          apiUsed = 'MyGene.info';
          responseText = `MyGene.info: Official symbol - ${myGeneData.value.symbol}, Name - ${myGeneData.value.name}`;
        } else if (
          disgenetData.status === 'fulfilled' &&
          disgenetData.value.length > 0
        ) {
          apiUsed = 'DisGeNET';
          responseText = `DisGeNET: Found ${disgenetData.value.length} gene-disease associations.`;
        } else if (
          stringData.status === 'fulfilled' &&
          stringData.value.length > 0
        ) {
          apiUsed = 'STRING-DB';
          responseText = `STRING-DB: Found ${stringData.value.length} protein interactions.`;
        } else {
          responseText = 'No data found for your query.';
        }

        if (uniprotData.status === 'fulfilled' && uniprotData.value) {
          try {
            console.log('Fetching ChEMBL data...');
            const chemblData = await fetchChEMBLData(
              uniprotData.value.primaryAccession
            );
            if (chemblData.length > 0) {
              responseText += `\nChEMBL: Found ${chemblData.length} bioactivity records.`;
            }
          } catch (err) {
            console.warn('ChEMBL API failed:', err);
          }
        }
      }

      console.log('Search completed, response:', responseText);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: responseText },
      ]);
      setHistory((prev) => [...prev, { prompt: query, response: responseText }]);
      try {
        console.log('Saving message to MongoDB Atlas...');
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
        console.log('Saving error message to MongoDB Atlas...');
        await saveMessage(query, errorMsg);
      } catch (err) {
        console.error('Failed to save error message:', err);
      }
    }
  };

  const handleSend = async (userInput) => {
    if (!userInput) return;

    setMessages((prev) => [...prev, { sender: 'user', text: userInput }]);
    const botResponse = '🤖 Processing your query...';
    setMessages((prev) => [...prev, { sender: 'bot', text: botResponse }]);
    setHistory((prev) => [
      ...prev,
      { prompt: userInput, response: botResponse },
    ]);
    try {
      console.log('Saving processing message to MongoDB Atlas...');
      await saveMessage(userInput, botResponse);
    } catch (err) {
      console.error('Failed to save processing message:', err);
    }

    await handleSearch(userInput);
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