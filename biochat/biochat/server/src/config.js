module.exports = {
    openaiApiKey: process.env.OPENAI_API_KEY,
    disgenetApiKey: process.env.DISGENET_API_KEY,
    redisUrl: process.env.REDIS_URL,
    apiEndpoints: {
      uniProt: 'https://rest.uniprot.org/uniprotkb',
      alphaFold: 'https://alphafold.ebi.ac.uk/files',
      chembl: 'https://www.ebi.ac.uk/chembl/api/data',
      disgenet: 'https://www.disgenet.org/api',
      stringDb: 'https://string-db.org/api',
    },
  };