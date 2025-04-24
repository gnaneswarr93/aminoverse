import axios from 'axios';

export const fetchChEMBLData = async (uniprotId) => {
  try {
    const response = await axios.get(
      `https://www.ebi.ac.uk/chembl/api/data/activity?target_chembl_id__uniprot=${uniprotId}&limit=10`
    );
    return response.data.activities || [];
  } catch (error) {
    console.error('ChEMBL API Error:', error);
    throw error;
  }
};