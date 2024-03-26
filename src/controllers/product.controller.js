import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "..//utils/cloudinary.js";

const addProduct = asyncHandler(async (req,res)=>{
    const {name,description,quantity,price,category,sku,color, reviews} = req.body;

    const imgPath = req.files?.productImg[0]?.path;

    if (!imgPath) {
        throw new ApiError(400, "Product image required");
    }

    const img = await uploadOnCloudinary(imgPath);

    if(!img){
        throw new ApiError(400, "Product image required");
    }

    const product = await Product.create({
        name,
        description,
        price,
        quantity,
        reviews:[],
        category,
        productImg: img.url,
        sku,
        color
    })

    if(!product){
        throw new ApiError(500, "Something went wrong while adding product");
    }
    return res
        .status(201)
        .json(new ApiResponse(200, product, "product added successfully"))
})

const fetchProducts = asyncHandler(async (req, res) => {
    // Fetch all products from the database
    const { color, category, priceRange } = req.query;
    console.log(req.query);
  
  // Define filter object
  const filter = {};

  // Add filters to the filter object if they are not null
  if (color !== 'none') {
    filter.color = color;
  }
  if (category !== 'none') {
    filter.category = category;
  }
  if (priceRange !== 'none') {
    // Parse price range if needed (assuming it's a string like "minPrice-maxPrice")
    // Add price range filter to the filter object
    filter.price = { $gte: parseFloat(priceRange.min), $lte: parseFloat(priceRange.max) };
  }

  // Fetch products from the database based on the filter
  // console.log(filter);
  const products = await Product.find(filter);
  // console.log(products);
  
    // Check if products exist
    if (!products || products.length === 0) {
      throw new ApiError(404, "No products found");
    }
  
    // Return products in the response
    res.status(200).json(new ApiResponse(200, products, "Products fetched successfully"));
  });

const fetchProductById = asyncHandler(async (req, res) => {
  // Extract the SKU from the request parameters
  const { id } = req.params;

  // Fetch the product from the database by its SKU
  const product = await Product.findOne({ sku: id });

  // Check if product exists
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Return the product in the response
  res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
});


  
export {addProduct,fetchProducts, fetchProductById}