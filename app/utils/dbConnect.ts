import mongoose from "mongoose";

let isConnected: boolean = false; // Track connection state outside function

export const connectDb = async (): Promise<void> => {
  if (isConnected) return;

  try {
    if (mongoose.connection.readyState >= 1) {
      isConnected = true;
      return;
    }

    await mongoose.connect(process.env.MONGO_DB_URL as string, {
      dbName: "PasswordDB",
      // Optional performance flags
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Fail fast (DSA rule: if init fails, exit)
  }
};
