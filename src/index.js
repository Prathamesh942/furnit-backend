import express from "express";

const app = express();

app.listen(process.env.PORT || 8000, () => {
  console.log("app started on port 8000");
});