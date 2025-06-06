import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connection successful to DB");
  } catch (error) {
    console.log("database connection failed", error);
    process.exit(0);
  }
};
