import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch(query.trim());
    }
  };

  return (
    <div className="flex justify-center mt-6">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search for protein, gene, variant, or disease..."
        className="w-2/3 md:w-1/2 px-4 py-2 rounded-full bg-black border-2 border-neon text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon transition duration-300"
      />
      <button
        type="button"
        onClick={() => onSearch(query.trim())}
        className="ml-2 px-4 py-2 bg-neon text-black font-semibold rounded-full hover:bg-neon-dark transition"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;