// src/api/chatbot.js
const fetch = require('node-fetch');

// Replace with your actual API key
const GEMINI_API_KEY = 'AIzaSyDaNXPk-cAnVCd7Eq6b5a_aB-zlcd9A1Gg';

export async function generateChatbotResponse(query) {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `Provide detailed information about ${query}, including biological function and onlyu give response if it is related to human being onlly.` }
            ]
          }
        ],
        generationConfig: {
          temperature: 1,
          topK: 40,
          topP: 0.95,
          maxOutputTokens:500
        }
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return data.candidates[0].content.parts[0].text || 'No response from Gemini API.';
    } else {
      console.error('Gemini API error:', data);
      return 'Error fetching data from Gemini API. Please try again.';
    }
  } catch (error) {
    console.error('Error generating response:', error.message);
    return 'Error: Network issue or invalid API key. Please try again.';
  }
}
