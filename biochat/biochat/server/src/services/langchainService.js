const { OpenAI } = require('langchain/llms/openai');
const { Memory } = require('langchain/memory');
const uniProtService = require('./uniProtService');
const alphaFoldService = require('./alphaFoldService');
const chemblService = require('./chemblService');
const disgenetService = require('./disgenetService');
const stringDbService = require('./stringDbService');
const cache = require('../utils/cache');
const config = require('../config');

const llm = new OpenAI({ apiKey: config.openaiApiKey });
const memory = new Memory({ sessionId: 'default' });

async function processQuery(query, sessionId) {
  memory.sessionId = sessionId;
  const cached = await cache.get(query);
  if (cached) return cached;

  // Simple intent parsing (extend with regex or NLP for production)
  const lowerQuery = query.toLowerCase();
  let response = { response: '', structure: null };

  // Store context
  await memory.saveContext({ input: query });

  if (lowerQuery.includes('protein') || lowerQuery.includes('gene')) {
    const entity = query.match(/(?:protein|gene)\s+(\w+)/i)?.[1] || 'BRCA1';
    await memory.saveContext({ entity });

    if (lowerQuery.includes('function')) {
      const data = await uniProtService.getProteinFunction(entity);
      response.response = data.function || 'No function data available.';
    } else if (lowerQuery.includes('structure')) {
      const data = await alphaFoldService.getStructure(entity);
      response.response = '3D structure loaded.';
      response.structure = data.pdbUrl;
    } else if (lowerQuery.includes('drug')) {
      const data = await chemblService.getDrugAssociations(entity);
      response.response = data.drugs?.join(', ') || 'No drug data available.';
    } else if (lowerQuery.includes('disease')) {
      const data = await disgenetService.getDiseaseAssociations(entity);
      response.response = data.diseases?.join(', ') || 'No disease data available.';
    } else if (lowerQuery.includes('interaction')) {
      const data = await stringDbService.getInteractions(entity);
      response.response = data.interactions?.join(', ') || 'No interaction data available.';
    } else {
      // General query: fetch overview
      const functionData = await uniProtService.getProteinFunction(entity);
      const diseaseData = await disgenetService.getDiseaseAssociations(entity);
      response.response = `Overview for ${entity}:\nFunction: ${functionData.function || 'N/A'}\nDiseases: ${diseaseData.diseases?.join(', ') || 'N/A'}`;
    }
  } else {
    // Fallback to LLM
    response.response = await llm.predict(query);
  }

  await cache.set(query, response);
  return response;
}

module.exports = { processQuery };