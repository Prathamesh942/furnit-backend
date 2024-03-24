import { Router } from "express";

import { upload } from "../middlewares/multer.middleware.js"
import { addProduct, fetchProducts, fetchProductById } from "../controllers/product.controller.js";

const router = Router();

router.route("/add").post(
    upload.fields([
        {name: "productImg", maxCount:1}
    ]),
    addProduct   
)
router.route("/products").get(
    fetchProducts
)

router.route("/products/:id").get(
    fetchProductById
)

export default router