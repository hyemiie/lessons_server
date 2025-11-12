const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI not set in .env');
}


const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let db;

async function connect() {
  if (!db) {
    await client.connect();
    const url = new URL(uri);
    const pathname = url.pathname ? url.pathname.replace('/', '') : null;
    const dbName = process.env.DB_NAME || pathname;
    if (!dbName) {
      throw new Error('Database name not found. Set DB_NAME in .env or include database in MONGODB_URI');
    }
    db = client.db(dbName);
    console.log('Connected to MongoDB:', db.databaseName);
  }
  return db;
}

function getClient() {
  if (!client) throw new Error('Client not connected');
  return client;
}

module.exports = { connect, getClient };
