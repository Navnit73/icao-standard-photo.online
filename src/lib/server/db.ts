import { createHash } from "node:crypto";
import { MongoClient, type Collection } from "mongodb";

export type PhotoMetrics = {
  head_height_pct: number;
  eye_position_pct: number;
  top_margin_pct: number;
  background_valid: boolean;
  background_corrected: boolean;
};

export type PhotoRecord = {
  /** PixPassport result_id */
  _id: string;
  countryCode: string;
  documentType: string;
  dimensions: string;
  format: string;
  sizeKb: number;
  metrics: PhotoMetrics;
  /** Full-resolution photo, copied to our Cloudinary account */
  imageUrl: string;
  previewUrl: string;
  ipHash: string;
  userAgent: string;
  createdAt: Date;
  emailCount: number;
  emails: { email: string; sentAt: Date }[];
};

// Reuse one client across hot reloads in development
const globalForMongo = globalThis as unknown as { mongoClient?: Promise<MongoClient> };

function client() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  globalForMongo.mongoClient ??= new MongoClient(uri).connect();
  return globalForMongo.mongoClient;
}

export async function photos(): Promise<Collection<PhotoRecord>> {
  // Not "photos": that collection already holds another schema with a unique publicId index
  return (await client()).db(process.env.MONGODB_DB).collection<PhotoRecord>("photo_results");
}

/** Salted hash so we can rate-limit by IP without storing it */
export const hashIp = (ip: string) =>
  createHash("sha256").update(`${process.env.IP_HASH_SALT ?? ""}:${ip}`).digest("hex");
