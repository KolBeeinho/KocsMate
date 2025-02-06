// lib/mongodb.ts
import { MongoClient } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI as string;

export var mongo_client: MongoClient | undefined;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    mongo_client = new MongoClient(uri);
    global._mongoClientPromise = mongo_client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  mongo_client = new MongoClient(uri);
  clientPromise = mongo_client.connect();
}

export default clientPromise;
