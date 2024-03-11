import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const conn_instance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(conn_instance.connection.host);
  } catch (error) {
    console.log("Error connecting to db", error);
    process.exit(1);
  }
};

export default connectDB;
