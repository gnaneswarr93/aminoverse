import axios from 'axios';

export const fetchAlphaFoldStructure = async (uniprotId) => {
  try {
    const url = `https://alphafold.ebi.ac.uk/files/AF-${uniprotId}-F1-model_v4.pdb`;
    const response = await axios.get(url, { validateStatus: (status) => status === 200 });
    return url;
  } catch (error) {
    console.error('AlphaFold API Error:', error.response?.status, error.message);
    return null;
  }
};