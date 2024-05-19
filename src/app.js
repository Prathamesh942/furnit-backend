import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js"
import { verifyJWT } from "./middlewares/auth.middleware.js";

const app = express();

const allowedOrigins = ['http://localhost:5173', 'https://furnitstore.vercel.app', 'http://example2.com'];

app.use(cors({ 
    origin:  allowedOrigins,
    credentials: true 
  }));
app.use(bodyParser.json());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.get("/",verifyJWT,(req,res)=>{res.json("hii")})

export { app };
