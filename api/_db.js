import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import dns from 'dns';
import { deleteFromCloudinary } from './_cloudinary.js';

// Optimize DNS lookup order for MongoDB Atlas SRV resolution
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {
  // Ignore in environments where not available
}

dotenv.config({ override: true });

let cachedClient = null;
let cachedDb = null;

const HARDCODED_URI = 'mongodb+srv://arksvgnss_db_user:u4tG9wlcLJ1vaOod@cluster0.irkqomo.mongodb.net/samsculinary?retryWrites=true&w=majority&appName=Cluster0';
const DEFAULT_DB_NAME = 'samsculinary';
const WORKSHOP_COLLECTION_NAME = process.env.WORKSHOP_COLLECTION || 'oneday_workshop_registrations';

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  let uri = process.env.MONGODB_URI || HARDCODED_URI;
  let dbName = process.env.MONGODB_DB || DEFAULT_DB_NAME;

  try {
    const client = new MongoClient(uri, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    });

    await client.connect();
    const db = client.db(dbName);
    cachedClient = client;
    cachedDb = db;
    return { client, db };
  } catch (err) {
    cachedClient = null;
    cachedDb = null;
    console.error('MongoDB Atlas Connection Error:', err);
    throw err;
  }
}

/**
 * Builds filter matching registrationId, _id (ObjectId), or id
 */
export function buildIdFilter(id) {
  if (!id) return null;
  const orConditions = [
    { registrationId: id },
    { id: id }
  ];

  if (typeof id === 'string' && id.length === 24 && ObjectId.isValid(id)) {
    try {
      orConditions.push({ _id: new ObjectId(id) });
    } catch (_) {}
  }

  return { $or: orConditions };
}

/**
 * Fetch all registrations from the dedicated 'oneday_workshop_registrations' collection
 */
export async function getWorkshopRegistrations(query = {}) {
  const { db } = await connectToDatabase();
  const collection = db.collection(WORKSHOP_COLLECTION_NAME);
  const records = await collection.find(query).sort({ submittedAt: -1, _id: -1 }).toArray();
  return records.map(({ _id, ...rest }) => ({
    id: _id.toString(),
    ...rest
  }));
}

/**
 * Insert new workshop registration document
 */
export async function insertWorkshopRegistration(doc) {
  const { db } = await connectToDatabase();
  const collection = db.collection(WORKSHOP_COLLECTION_NAME);
  const newDoc = {
    ...doc,
    createdAt: new Date().toISOString()
  };
  const result = await collection.insertOne(newDoc);
  return { id: result.insertedId.toString(), ...newDoc };
}

/**
 * Update workshop registration document
 */
export async function updateWorkshopRegistration(id, updateFields) {
  const { db } = await connectToDatabase();
  const collection = db.collection(WORKSHOP_COLLECTION_NAME);
  const filter = buildIdFilter(id);

  if (!filter) return null;

  const result = await collection.findOneAndUpdate(
    filter,
    { $set: { ...updateFields, updatedAt: new Date().toISOString() } },
    { returnDocument: 'after' }
  );

  return result;
}

/**
 * Delete workshop registration document and its associated Cloudinary image
 */
export async function deleteWorkshopRegistration(id) {
  const { db } = await connectToDatabase();
  const collection = db.collection(WORKSHOP_COLLECTION_NAME);
  const filter = buildIdFilter(id);

  if (!filter) return { deletedCount: 0 };

  // First, find the document to check if there is an image to delete from Cloudinary
  const existing = await collection.findOne(filter);
  if (existing?.proofImageUrl) {
    try {
      await deleteFromCloudinary(existing.proofImageUrl);
    } catch (cErr) {
      console.warn('Could not remove image from Cloudinary:', cErr);
    }
  }

  const result = await collection.deleteOne(filter);
  return result;
}
