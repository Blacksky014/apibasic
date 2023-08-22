// ./src/utils/redisConnection.js

const redis = require("redis");
const { env } = require('../configs/envConfig');
const { promisify } = require('util');

const getConnectionOptions = {
  host: env.redis.host,
  port: env.redis.port,
  password: env.redis.password,
};
class RedisConnection {
  constructor(connectionString = getConnectionOptions) {
    this.connectionString = connectionString;
    this.client = redis.createClient(this.connectionString);
    this.connected = false;
  }

  async connect() {
    try {
      this.client = redis.createClient(this.connectionString);
      await new Promise((resolve, reject) => {
        this.client.connect();

        this.client.on('error', (error) => {
          console.error('Redis connection error:', error);
          reject(error);
        });

        this.client.on('connect', () => {
          console.log('Connected to Redis');
          resolve();
        });

        this.client.on('end', () => {
          console.log('Disconnected from Redis');
        });
      });
    } catch (error) {
      console.error('Error connecting to Redis:', error);
      // You may add reconnection logic here if desired
      throw error;
    }
  }

  async get(key) {
    const value = await this.client.get(key);
    return JSON.parse(value);
  }

  async set(key, value) {
    await this.client.set(key, JSON.stringify(value));
  }

  async close() {
    if (this.client && this.client.isReady) {
      await this.client.disconnect();
    } else {
      console.log('Client already disconnected');
    }
  }

  async getClient() {
    try {
      if (this.client && this.client.isReady) {
        return this.client;
      } else {
        await this.connect();
        return this.client;
      }
    } catch (error) {
      throw new Error("Redis client is not connected.");
    }
  }

  isClientConnected() {
    if (this.client) {
      return this.client.isReady;
    } else {
      return false;
    }
  }
}
module.exports = RedisConnection;
// Example Usage:
// const redis = require("redis");
// const RedisConnection = require("./redis-connection");
// const connectionString = "redis://localhost:6379";
// const redisConnection = new RedisConnection(connectionString);
// // Get a value from Redis
// const value = await redisConnection.get("key");
// console.log(value); // { "name": "John Doe" }
// // Set a value in Redis
// await redisConnection.set("key", { "name": "Jane Doe" });
// // Close the connection to Redis
// await redisConnection.close();
// Example Usage2:
// const RedisConnection = require('./utils/redisConnection');
// const redisConnection = new RedisConnection();
// await redisConnection.connect();
// const client = await redisConnection.getClient();
// await redisConnection.close();
