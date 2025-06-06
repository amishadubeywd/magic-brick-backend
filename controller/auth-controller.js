import bcrypt from 'bcryptjs'
import { User } from '../models/user-model.js';
import jwt from "jsonwebtoken";

export const Home = async (req, res) => {
  try {
    console.log("Hello")
    res.status(200).send("Welcome to Hello World Home");
  } catch (error) {
    console.error("Home error", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};



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

    const saltRound = 10;
    const user = await bcrypt.hash(password, saltRound);   
    if (user) {
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