import bcrypt from 'bcryptjs'
import { User } from '../models/user-model.js';
import jwt from "jsonwebtoken";



export const register = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const saltRound = 10;
    const hash_password = await bcrypt.hash(password, saltRound);

    const userCreated = await User.create({
      username,
      email,
      phone,
      password: hash_password,
    });
    res.status(200).json({
      msg: "Registration Successfully",
      userId: userCreated._id.toString(),
    });
  } catch (error) {
    console.error("Registration error", error);
    res.status(400).json({ msg: "Registration failed" });
  }
};

// User Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login data", email, password);
    const userExist = await User.findOne({ email });
    console.log("USER", userExist);
    if (!userExist) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    
    const isPasswordMatch = await bcrypt.compare(password, userExist.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }
    if (isPasswordMatch) {
      res.status(200).json({
        msg: "Login Successfully",
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
        username : userExist.username,
      });
    } else {
      res.status(401).json({ msg: "Invalid Credentials" });
    }
  } catch (error) {
    console.error("Login error", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};


export const getUserProfile = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); 
    const user = await User.findById(decoded.userId).select("-password");
    console.log("User",user)

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(401).json({ msg: "Unauthorized" });
  }
};


export const purchaseRequestDeletePropertyById = async (req, res) => {
  try {
    const { id } = req.params; 
    const token = req.headers.authorization.split(" ")[1]; 
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); 

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
   
    const propertyIndex = user.purchaseRequests.findIndex(
      (request) => request.propertyId == id
    );
    console.log(propertyIndex)
    if (propertyIndex === -1) {
      return res.status(404).json({ msg: "Property not found in purchase requests" });
    }

    user.purchaseRequests.splice(propertyIndex, 1);

    await user.save();

    res.status(200).json({ msg: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ msg: "Failed to delete property" });
  }
};