import connectDB from "./db/index.js";

import { app } from "./app.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log("app started on port 8000");
    });
  })
  .catch((error) => {
    console.log(error);
  });
