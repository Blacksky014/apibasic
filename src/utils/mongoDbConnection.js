const { MongoClient, ObjectId } = require('mongodb');
const { env } = require('../configs/envConfig');

const getConnectionOptions = {
  connectionString: `mongodb://${env.database.host}:${env.database.port}/${env.database.name}`,
  databaseName: env.database.name,
  retryInterval: 5000, // Retry connection every 5 seconds
};

class MongoDBConnection {
  constructor(connectionOptions = getConnectionOptions) {
    this.connectionString = connectionOptions.connectionString || 'mongodb://localhost:27017';
    this.databaseName = connectionOptions.databaseName || 'tempdb';
    this.client = null;
    this.db = null;
    this.retryInterval = connectionOptions.retryInterval || 5000; // Retry connection every 5 seconds (adjust as needed)
  }

  async connect() {
    const isConnected = !this.client ? false : this.client.topology.isConnected();
    if (!isConnected) {
      try {
        this.client = new MongoClient(this.connectionString, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });

        await this.client.connect();
        this.db = this.client.db(this.databaseName);

        console.log('Connected to MongoDB');
      } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        console.log(`Retrying connection in ${this.retryInterval / 1000} seconds...`);
        await this.sleep(this.retryInterval);
      }
    } else {
      // console.log('MongoDB already connected');
    }
  }

  async disconnect() {
    const isConnected = !this.client ? false : this.client.topology.isConnected();
    if (isConnected) {
      if (this.client) {
        // await this.client.close();
        this.client = null;
      }
      console.log('Disconnected from MongoDB');
    }
  }

  async getClient() {
    const isConnected = !this.client ? false : this.client.topology.isConnected();
    if (!isConnected) {
      console.log('MongoDB client is not connected. Reconnecting...');
      await this.client.connect();
    }

    return this.client;
  }

  async getDatabase() {
    if (!this.db) {
      throw new Error('MongoDB client is not connected. Call getClient() to establish a connection first.');
    }
    return this.db;
  }

  async seedData() {
    const session = this.client.startSession();
    session.startTransaction();

    try {
      const db = await this.getDatabase();

      const userCollection = db.collection('users');
      // Check if data already exists
      const count = await userCollection.countDocuments({}, { session });
      if (count > 0) {
        console.log('The data has already been seeded.');
        await session.commitTransaction();
        await session.endSession();
        return;
      }
      
      // Seed data
      const usersData = [
        {
          _id: new ObjectId("649ef4c8203e9ff09773d8e7"),
          name: "admin",
          email: "admin@apibasic.com",
          password: "$2a$10$T6.YromzZ7C1wk2Z0z7xROOn3WiUxSL8qtYuFxBe/SRBotRxvt0iC", // password 123456
          mobile: "+9595118364",
          role: "admin",
          photoName: "photo-1690400650363.jpg"
        },
        {
          _id: new ObjectId("649ef7996a704ffbf9157543"),
          name: "user",
          email: "user@apibasic.com",
          password: "$2a$10$HUHPfcz/iu/4UfGV8nvVteFJ47XTgdrIvNAZe8zs.C7Fk7DGPDzmi",
          mobile: "+959799667739",
          role: "user",
          photoName: "photo-1690400650363.jpg"
        }
      ];
      await userCollection.insertMany(usersData, { session });


      const roleCollection = db.collection('roles');
      // Create an index on the "name" field for faster queries
      await roleCollection.createIndex({ name: 1 });
      await roleCollection.insertMany([
        { name: 'admin', permissions: ['create', 'read', 'update', 'delete'] },
        { name: 'user', permissions: ['read'] },
        { name: 'guest', permissions: [] },
      ]);

      await session.commitTransaction();
      await session.endSession();
      console.log('The data has been successfully seeded');
    } catch (error) {
      console.error('Error seeding data:', error);
      await session.abortTransaction();
      await session.endSession();
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = MongoDBConnection;
