const axios = require('axios');
const config = require('../config');

async function getDrugAssociations(protein) {
  try {
    const response = await axios.get(`${config.apiEndpoints.chembl}/target?query=${protein}`);
    return { drugs: response.data.targets?.map(t => t.pref_name) || [] };
  } catch (error) {
    return { drugs: [] };
  }
}

module.exports = { getDrugAssociations };