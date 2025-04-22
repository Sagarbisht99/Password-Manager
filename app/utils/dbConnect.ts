import mongoose from "mongoose";

export const connectDb = async () => {
  if (mongoose.connections[0].readyState) return;

  try {
    await mongoose.connect(process.env.MONGO_DB_URL as string, {
      dbName: "PassswordDB",
    });

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.log(error, "This is not working");
  }
};
