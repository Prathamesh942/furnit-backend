import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if ([name, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "user with email or username already exist");
  }

  const user = await User.create({
    name,
    email,
    password,
  });
  const createduser = await User.findById(user._id).select("-password");
  if (!createduser) {
    throw new ApiError(500, "something went wrong registering user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createduser, "user registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    throw new ApiError(400, "Email required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "user do not exists");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid user credentials");
  }
  const accessToken = await user.generateAccessToken();

  const loggedInUser = await User.findById(user._id).select("-password");

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken },
        "user logged in successfully"
      )
    );
});

const cart = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("cart.product");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user.cart, "populated"); // This should now log detailed product information
    res.json(user.cart); // Respond with the populated cart data
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addcart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;
    const user = await User.findById(userId);

    console.log(productId);
    console.log(quantity);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(user.cart);

    let cartItem = user.cart.find((item) => item.product?.equals(productId));

    console.log("product exists", cartItem);

    if (!cartItem) {
      user.cart.push({ product: productId, quantity });
    } else {
      console.log(cartItem.quantity);
      cartItem.quantity += quantity;
      console.log(cartItem.quantity);
    }

    await user.save();

    res.status(200).json({ message: "Product added to cart successfully" });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const remove = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(user.cart, productId);
    const index = user.cart.findIndex((item) => item.product.equals(productId));

    if (index === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    user.cart.splice(index, 1);

    await user.save();

    res.status(200).json({ message: "Product removed from cart successfully" });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const checkout = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("cart.product");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.purchasedProducts = user.purchasedProducts.concat(
      user.cart.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      }))
    );
    user.cart = [];
    console.log(user);
    await user.save();

    res.status(200).json({ message: "Checkout successful", user });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const orders = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate(
      "purchasedProducts.product"
    );
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ order: user.purchasedProducts });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export { registerUser, loginUser, cart, addcart, checkout, remove, orders };
