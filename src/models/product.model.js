import mongoose, { Schema } from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  review: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  }
});


const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    enum: ['Sofas', 'Chairs', 'Tables', 'Beds', 'Desks', 'Cabinets', 'Shelves']
  },
  productImg: {
    type: String,
    required: true
  },
  sku: String,
  color: {
    type: String,
    enum: ['ivory', 'espresso', 'charcoal', 'sandstone', 'mahogany', 'navy', 'sage', 'ruby']
  },
  reviews: [reviewSchema] 
});

export const Product = mongoose.model('Product', productSchema);