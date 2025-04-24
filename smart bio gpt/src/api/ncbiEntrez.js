import axios from 'axios';

export const fetchEntrezGeneData = async (query) => {
  try {
    const response = await axios.get(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=gene&term=${query}&retmode=json`
    );
    const result = response.data.result;
    const geneId = Object.keys(result).find((key) => key !== 'uids');
    return result[geneId] || null;
  } catch (error) {
    console.error('NCBI Entrez API Error:', error);
    throw error;
  }
};