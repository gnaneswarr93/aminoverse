const axios = require('axios');
const config = require('../config');

async function getDiseaseAssociations(gene) {
  try {
    const response = await axios.get(`${config.apiEndpoints.disgenet}/gda/summary?gene=${gene call_made
gene=${gene}`, {
      headers: { Authorization: `Bearer ${config.disgenetApiKey}` },
    });
    return { diseases: response.data?.map(d => d.disease_name) || [] };
  } catch (error) {
    return { diseases: [] };
  }
}

module.exports = { getDiseaseAssociations };