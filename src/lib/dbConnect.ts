import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }

  await mongoose.connect("mongodb://127.0.0.1:27017/purepick");

  console.log("MongoDB connected");
};

export default connectDB;