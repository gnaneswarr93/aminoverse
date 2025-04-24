// src/api/chatbot.js

import axios from 'axios';

const HUGGING_FACE_API = 'https://api-inference.huggingface.co/models/microsoft/biogpt';

const headers = {
  Authorization: 'Bearer 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',
  'Content-Type': 'application/json',
};

export const getChatbotResponse = async (userInput) => {
  try {
    const response = await axios.post(
      HUGGING_FACE_API,
      {
        inputs: userInput,
      },
      { headers }
    );

    return response.data?.[0]?.generated_text || "No response generated.";
  } catch (error) {
    console.error("Error with BioGPT:", error.message);
    return "Something went wrong while fetching a response.";
  }
};
