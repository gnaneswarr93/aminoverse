import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://1patlavath:veWhMTySkxF5cSXk@cluster0.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

export async function saveMessage(prompt, response) {
  try {
    await client.connect();
    const database = client.db("smartbiogpt");
    const messages = database.collection("messages");
    const result = await messages.insertOne({ prompt, response, createdAt: new Date() });
    return result;
  } catch (e) {
    console.error("MongoDB Save Error:", e);
  } finally {
    await client.close();
  }
}
