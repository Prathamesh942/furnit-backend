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
    // console.log(req.user);
    // Retrieve the user's ID from the JWT token
    // console.log();
    const {userId} = req.body;
    console.log(userId);

    // Find the user in the database using the user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Retrieve the product IDs from the user's cart array
    const productIds = user.cart;

    // Fetch the products from the database based on the product IDs
    const products = await Product.find({ _id: { $in: productIds } });

    // Return the array of products
    res.json(products);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addcart = async (req, res) => {
  try {
    // Retrieve the product ID from the request body
    const {userId, productId } = req.body;

    // Retrieve the user's ID from the JWT token
    // const userId = req.user._id;

    // Find the user in the database using the user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the product ID to the user's cart array if it's not already there
    if (!user.cart.includes(productId)) {
      user.cart.push(productId);
      await user.save();
    }

    res.status(200).json({ message: "Product added to cart successfully" });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const checkout = async (req, res) => {
  try {
    // Retrieve the user's ID from the request body
    const { userId } = req.body;

    // Find the user in the database using the user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Move items from cart to purchasedProducts
    user.purchasedProducts = user.purchasedProducts.concat(user.cart);
    user.cart = [];

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Checkout successful", user });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { registerUser, loginUser, cart, addcart, checkout };