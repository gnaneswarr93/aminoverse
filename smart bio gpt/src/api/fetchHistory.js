export async function fetchHistory() {
    const url = 'http://localhost:5001/aminoverse-ca296/us-central1/api/getHistory';
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch history: ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      console.error('Error fetching history:', error);
      return [];
    }
  }