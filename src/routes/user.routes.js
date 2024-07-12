import { Router } from "express";
import {
  loginUser,
  registerUser,
  cart,
  addcart,
  checkout,
  remove,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/cart").get(verifyJWT, cart);
router.route("/add").post(verifyJWT, addcart);
router.route("/check").post(verifyJWT, checkout);
router.route("/remove").delete(verifyJWT, remove);

export default router;
