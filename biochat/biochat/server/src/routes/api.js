const express = require('express');
const langchainService = require('../services/langchainService');

const router = express.Router();

router.post('/query', async (req, res) => {
  const { query, sessionId } = req.body;
  try {
    const response = await langchainService.processQuery(query, sessionId);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process query' });
  }
});

module.exports = router;