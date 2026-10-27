import "server-only";
import { MongoClient, type Db } from "mongodb";
import { env } from "./env";

// Reuse one client across hot reloads in dev and across invocations in prod.
const globalForMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>;
  _mongoIndexesPromise?: Promise<void>;
};

function getClient(): Promise<MongoClient> {
  if (!globalForMongo._mongoClientPromise) {
    const client = new MongoClient(env.mongodbUri, {
      appName: "icao-standard-photo",
    });
    globalForMongo._mongoClientPromise = client.connect().catch((err) => {
      globalForMongo._mongoClientPromise = undefined;
      throw err;
    });
  }
  return globalForMongo._mongoClientPromise;
}

async function ensureIndexes(db: Db) {
  await Promise.all([
    db.collection("photos").createIndex({ publicId: 1 }, { unique: true }),
    db.collection("photos").createIndex({ createdAt: -1 }),
    db.collection("downloads").createIndex({ email: 1 }),
    db.collection("downloads").createIndex({ photoId: 1 }),
    db.collection("messages").createIndex({ createdAt: -1 }),
  ]);
}

export async function getDb(): Promise<Db> {
  const client = await getClient();
  const db = client.db(env.mongodbDb);
  if (!globalForMongo._mongoIndexesPromise) {
    globalForMongo._mongoIndexesPromise = ensureIndexes(db).catch((err) => {
      globalForMongo._mongoIndexesPromise = undefined;
      throw err;
    });
  }
  await globalForMongo._mongoIndexesPromise;
  return db;
}
