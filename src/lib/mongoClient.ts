import { attachDatabasePool } from '@vercel/functions';
import { MongoClient } from 'mongodb';

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error('MONGODB_URI env var is not set');
}

const mongoClientPromise =
  globalThis._mongoClientPromise ??
  new MongoClient(mongoUri).connect().then((client) => {
    attachDatabasePool(client);
    return client;
  });

globalThis._mongoClientPromise = mongoClientPromise;

export async function getMongoClient() {
  return mongoClientPromise;
}

export async function getMongoDb() {
  const client = await getMongoClient();
  return client.db(process.env.MONGODB_DB_NAME || 'profile');
}
