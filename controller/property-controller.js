import {Property} from "../models/property-model.js"
import { User } from "../models/user-model.js";

export const UploadData = async (req, res) => {
 try {
    const { userId, title, address, landmark, pincode, price, mobile } = req.body;
    const image = req.file ? req.file.path : null; 

    const newProperty = await Property.create({
      userId,
      title,
      address,
      landmark,
      pincode,
      mobile,
      price,
      image,
    });
    res.status(201).json({
      msg: "Data uploaded successfully",
      data: newProperty,
    });
  } catch (error) {
    console.error("UploadData error", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};  

export const fetchData = async (req, res)=>{
    try {
        const data = await Property.find();
        console.log(data);
        res.status(201).json({msg:"data fetched successfully", property: data})
    } catch (error) {
        console.error("Fetched data Error", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}

export const getUserProperties = async (req, res) => {
  try {
    const userId = req.user.id; // Extract userId from the authenticated user
    const properties = await Property.find({ userId }); // Fetch properties for the user

    if (!properties || properties.length === 0) {
      return res.status(404).json({ msg: "No properties found for this user" });
    }

    res.status(200).json({ properties });
  } catch (error) {
    console.error("Error fetching user properties:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const savePurchaseRequest = async (req, res) => {
  try {
    const { propertyId } = req.body;

    const userId = req.user.id;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ msg: "Property not found" });
    }

    const user = await User.findById(userId);
    user.purchaseRequests.push(propertyId);
    await user.save();

    res.status(200).json({ msg: "Purchase request saved successfully" });
  } catch (error) {
    console.error("Error saving purchase request:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({ property });
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({ message: "Failed to fetch property" });
  }
};


export const deletePropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findByIdAndDelete(id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ message: "Failed to delete property" });
  }
};


export const updatePropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    // Prepare updated data
    const updatedData = { ...req.body };
    if (req.file) {
      updatedData.image = req.file.path; // Save the file path
    }

    const property = await Property.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({ message: "Property updated successfully", property });
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ message: "Failed to update property" });
  }
};

