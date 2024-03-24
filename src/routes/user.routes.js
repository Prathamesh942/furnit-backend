import { Router } from "express";
import { loginUser, registerUser,cart } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();



router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/cart").post( verifyJWT, cart)

export default router;
