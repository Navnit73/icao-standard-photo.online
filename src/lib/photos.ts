import "server-only";
import type { ObjectId } from "mongodb";
import { getDb } from "./mongodb";
import type { ProcessMetrics, ProcessResponse } from "./pixpassport";

export type ClientInfo = {
  ip: string | null;
  userAgent: string | null;
  country: string | null;
};

export type PhotoDoc = {
  _id?: ObjectId;
  publicId: string;
  status: "processing" | "processed" | "failed";
  countryCode: string;
  documentType: string;
  original: { filename: string; mimeType: string; sizeBytes: number };
  result?: {
    resultId: string;
    imageUrl: string;
    previewUrl: string | null;
    dimensions: string;
    format: string;
    sizeKb: number;
    metrics: ProcessMetrics;
  };
  apiResponse?: unknown;
  error?: { message: string; status: number; body: unknown };
  client: ClientInfo;
  emails: string[];
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
  processedAt?: Date;
};

export type DownloadDoc = {
  _id?: ObjectId;
  photoId: string;
  email: string;
  marketingConsent: boolean;
  client: ClientInfo;
  createdAt: Date;
};

export type MessageDoc = {
  _id?: ObjectId;
  kind: "contact" | "support";
  name: string;
  email: string;
  subject: string;
  message: string;
  photoId: string | null;
  client: ClientInfo;
  status: "new";
  createdAt: Date;
};

async function photos() {
  return (await getDb()).collection<PhotoDoc>("photos");
}

export async function createPhoto(
  doc: Pick<PhotoDoc, "publicId" | "countryCode" | "documentType" | "original" | "client">,
) {
  const now = new Date();
  await (await photos()).insertOne({
    ...doc,
    status: "processing",
    emails: [],
    downloadCount: 0,
    createdAt: now,
    updatedAt: now,
  });
}

export async function markPhotoProcessed(publicId: string, response: ProcessResponse) {
  const now = new Date();
  await (await photos()).updateOne(
    { publicId },
    {
      $set: {
        status: "processed",
        result: {
          resultId: response.result_id,
          imageUrl: response.image_url,
          previewUrl: response.preview_url,
          dimensions: response.dimensions,
          format: response.format,
          sizeKb: response.size_kb,
          metrics: response.metrics,
        },
        apiResponse: response,
        processedAt: now,
        updatedAt: now,
      },
    },
  );
}

export async function markPhotoFailed(
  publicId: string,
  error: { message: string; status: number; body: unknown },
) {
  await (await photos()).updateOne(
    { publicId },
    { $set: { status: "failed", error, updatedAt: new Date() } },
  );
}

export async function getPhoto(publicId: string): Promise<PhotoDoc | null> {
  return (await photos()).findOne({ publicId });
}

export async function recordDownload(input: {
  photoId: string;
  email: string;
  marketingConsent: boolean;
  client: ClientInfo;
}) {
  const db = await getDb();
  await Promise.all([
    db.collection<DownloadDoc>("downloads").insertOne({ ...input, createdAt: new Date() }),
    db.collection<PhotoDoc>("photos").updateOne(
      { publicId: input.photoId },
      {
        $addToSet: { emails: input.email },
        $inc: { downloadCount: 1 },
        $set: { updatedAt: new Date() },
      },
    ),
  ]);
}

export async function saveMessage(input: Omit<MessageDoc, "_id" | "status" | "createdAt">) {
  const db = await getDb();
  const { insertedId } = await db
    .collection<MessageDoc>("messages")
    .insertOne({ ...input, status: "new", createdAt: new Date() });
  return insertedId.toHexString();
}
