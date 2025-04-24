import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://1patlavath:veWhMTySkxF5cSXk@cluster0.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

export async function saveMessageLocal(prompt, response) {
  try {
    await client.connect();
    const coll = client.db("aminoverse").collection("messages");
    const r = await coll.insertOne({ prompt, response, createdAt: new Date() });
    return r;
  } catch (e) {
    console.error("MongoDB Save Error:", e);
  } finally {
    await client.close();
  }
}
