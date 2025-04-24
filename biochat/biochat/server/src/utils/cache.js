const Redis = require('ioredis');
const config = require('../config');

const client = new Redis(config.redisUrl);

async function get(key) {
  const data = await client.get(key);
  return data ? JSON.parse(data) : null;
}

async function set(key, value) {
  await client.set(key, JSON.stringify(value), 'EX', 3600); // Cache for 1 hour
}

module.exports = { get, set };