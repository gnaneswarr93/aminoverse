const axios = require('axios');
const config = require('../config');

async function getProteinFunction(protein) {
  try {
    const response = await axios.get(`${config.apiEndpoints.uniProt}/${protein}`);
    return { function: response.data.comments?.find(c => c.commentType === 'FUNCTION')?.text || 'No function data' };
  } catch (error) {
    return { function: 'Error fetching UniProt data' };
  }
}

module.exports = { getProteinFunction };