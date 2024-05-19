import { Router } from "express";
import { loginUser, registerUser,cart,addcart,checkout } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();



router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/cart").post( cart);
router.route("/add").post( addcart);
router.route("/check").post(checkout);

export default router;
