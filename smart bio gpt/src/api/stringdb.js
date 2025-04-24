import axios from 'axios';

export const fetchStringDBData = async (protein, species = '9606') => {
  try {
    const response = await axios.get(
      'http://localhost:5001/aminoverse-ca296/us-central1/proxyStringDB',
      { params: { identifier: protein, species }, timeout: 10000 }
    );
    return response.data || [];
  } catch (error) {
    console.error('STRING-DB API Error:', error.response?.status, error.message);
    return [];
  }
};