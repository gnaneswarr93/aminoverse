const axios = require('axios');
const config = require('../config');

async function getInteractions(protein) {
  try {
    const response = await axios.get(`${config.apiEndpoints.stringDb}/json/network?identifier=${protein}`);
    return { interactions: response.data?.map(i => i.stringId_B) || [] };
  } catch (error) {
    return { interactions: [] };
  }
}

module.exports = { getInteractions };