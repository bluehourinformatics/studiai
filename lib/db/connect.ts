import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// In Next.js, hot-reloading can create multiple connections.
// Cache the promise on the global object to reuse it.
declare global {
  // eslint-disable-next-line no-var
  var _mongoosePromise: Promise<typeof mongoose> | undefined;
}

let cached = global._mongoosePromise;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached) {
    return cached;
  }

  cached = global._mongoosePromise = mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
  });

  return cached;
}
