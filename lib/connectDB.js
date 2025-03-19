import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("MongoDB is coneected");
  } catch (err) {
    console.log(err);
  }
};

export default connectDB;
