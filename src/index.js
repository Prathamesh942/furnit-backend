import express from "express";
import connectDB from "./db/index.js";

const app = express();

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log("app started on port 8000");
    });
  })
  .catch((error) => {
    console.log(error);
  });
