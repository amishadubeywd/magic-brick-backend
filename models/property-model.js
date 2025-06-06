import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
    required: false,
  },
  pincode: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  price:{
    type: String,
    required:true,
  },
  image: {
    type: String, 
    required: false, 
  },
}, { timestamps: true });

export const Property = mongoose.model("Property", propertySchema);