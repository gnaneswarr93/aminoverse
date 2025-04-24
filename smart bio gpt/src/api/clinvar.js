import axios from 'axios';

export const fetchClinVarData = async (query) => {
  try {
    const response = await axios.get(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=clinvar&term=${query}&retmode=json`
    );
    const result = response.data.result;
    const variantId = Object.keys(result).find((key) => key !== 'uids');
    return result[variantId] || null;
  } catch (error) {
    console.error('ClinVar API Error:', error);
    throw error;
  }
};