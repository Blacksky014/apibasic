// ./src/index.js

const express = require('express');
const MongoDBConnection = require('./utils/mongoDbConnection');
const dbConnection = new MongoDBConnection();
const RedisConnection = require('./utils/redisConnection');
const redisConnection = new RedisConnection();
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { env, validateEnv } = require('./configs/envConfig');

const app = express();

// Validate Env
validateEnv();

// Connect to Databases
async function connectToDatabase() {
  // Connect to MongoDB and seed data
  await dbConnection.connect();
  await dbConnection.getDatabase().then(async() => {
    await dbConnection.seedData();
    await dbConnection.disconnect();
  });
  // Connect to Redis
  await redisConnection.connect();
  const client = await redisConnection.getClient();
  await redisConnection.close();

}
connectToDatabase();

// Middleware to parse JSON request bodies
app.use(express.json());

// Routes path
app.use(env.server.apiBasePath, routes);


// Error handler middleware
app.use(errorHandler);

// Start the server
const port = env.server.port || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
