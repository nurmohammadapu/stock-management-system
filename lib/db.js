import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI; 

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

// Global cache to prevent multiple connections in development
let cached = global.mongoose || { conn: null, promise: null };

async function connectToDatabase() {
    if (cached.conn) return cached.conn; // Return existing connection

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {}).then((mongoose) => mongoose);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectToDatabase;