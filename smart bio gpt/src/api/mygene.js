import axios from 'axios';

export const fetchMyGeneData = async (query) => {
  try {
    const response = await axios.get(`https://mygene.info/v3/query?q=${query}&fields=all`);
    return response.data.hits[0] || null;
  } catch (error) {
    console.error('MyGene.info API Error:', error);
    throw error;
  }
};