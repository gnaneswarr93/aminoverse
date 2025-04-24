const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { MongoClient } = require('mongodb');
const cors = require('cors')({ origin: true });
const axios = require('axios');

admin.initializeApp();
const uri = 'mongodb+srv://1patlavath:veWhMTySkxF5cSXk@cluster0.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);

exports.saveMessage = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      await client.connect();
      const db = client.db('smartbiogpt');
      const messages = db.collection('messages');
      const { prompt, response } = req.body;
      const result = await messages.insertOne({
        prompt,
        response,
        createdAt: new Date(),
      });
      res.status(200).json({ id: result.insertedId });
    } catch (error) {
      console.error('Save Message Error:', error);
      res.status(500).json({ error: 'Failed to save message' });
    } finally {
      await client.close();
    }
  });
});

exports.getHistory = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      await client.connect();
      const db = client.db('smartbiogpt');
      const messages = db.collection('messages');
      const history = await messages.find().sort({ createdAt: -1 }).toArray();
      res.status(200).json(history);
    } catch (error) {
      console.error('Get History Error:', error);
      res.status(500).json({ error: 'Failed to fetch history' });
    } finally {
      await client.close();
    }
  });
});

exports.proxyStringDB = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const response = await axios.get(
        `https://string-db.org/api/json/network?identifier=${req.query.identifier}&species=${req.query.species || '9606'}`
      );
      res.status(200).json(response.data);
    } catch (error) {
      console.error('STRING-DB Proxy Error:', error);
      res.status(500).json({ error: 'Failed to fetch STRING-DB data' });
    }
  });
});