import axios from 'axios';

export const fetchUniProtData = async (query) => {
  try {
    const response = await axios.get(
      `https://rest.uniprot.org/uniprotkb/search?query=${query}&format=json`,
      { timeout: 10000 }
    );
    return response.data.results?.[0] || null;
  } catch (error) {
    console.error('UniProt API Error:', error.response?.status, error.message);
    return null;
  }
};