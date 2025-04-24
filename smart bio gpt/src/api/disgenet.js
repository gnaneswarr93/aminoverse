import axios from 'axios';

export const fetchDisGeNETData = async (query) => {
  try {
    const response = await axios.get(
      `https://www.disgenet.org/api/gda/gene/${query}`,
      {
        headers: { Authorization: 'Bearer 5394743c-450b-4b67-99be-4c42d3530115' },
        timeout: 10000,
      }
    );
    console.log('DisGeNET API Success:', response.data);
    return response.data || [];
  } catch (error) {
    console.error(
      'DisGeNET API Error:',
      error.response?.status,
      error.message,
      error.response?.data
    );
    return [];
  }
};