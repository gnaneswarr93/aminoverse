export async function saveMessage(prompt, response) {
  const url = 'http://localhost:5001/aminoverse-ca296/us-central1/api/saveMessage';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, response }),
    });
    if (!res.ok) {
      throw new Error(`Failed to save message: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error saving message:', error);
    return null;
  }
}