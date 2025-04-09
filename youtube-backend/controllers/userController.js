import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// const cookieOptions = {
//   httpOnly: true,
//   secure: false, // In development, secure should be false
//   sameSite: "Lax", // Lax works fine for development
//   // secure: process.env.NODE_ENV === "production", // Set secure cookies in production
//   // sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
//   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
// };
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // True in production (HTTPS)
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};


// SIGNUP Controller
export const signUp = async (req, res) => {
  try {
    const { channelName, userName, email, about, profilePic, password } =
      req.body;

    const isUserNameTaken = await User.findOne({ userName });
    if (isUserNameTaken) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const isEmailTaken = await User.findOne({ email });
    if (isEmailTaken) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      channelName,
      userName,
      email,
      about,
      profilePic,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: _, ...userData } = newUser._doc;

    res
      .status(201)
      .cookie("token", token, cookieOptions)
      .json({ message: "User registered successfully", user: userData, token });
  } catch (error) {
    console.error("SignUp Error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// SIGNIN Controller
export const signIn = async (req, res) => {
  try {
    const { userName, password } = req.body;

    // Check if userName is an email
    const isEmail = /\S+@\S+\.\S+/.test(userName);

    // Find user by either email or username
    const user = await User.findOne(
      isEmail ? { email: userName } : { userName }
    ).select("+password");

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    const { password: _, ...userData } = user._doc;

    res
      .cookie("token", token, cookieOptions)
      .json({ message: "Login successful", user: userData, token });
  } catch (error) {
    console.error("SignIn Error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// LOGOUT Controller
export const logout = (req, res) => {
  res
    .clearCookie("token", {
      ...cookieOptions,
      maxAge: 0,
    })
    .json({ message: "Logged out successfully" });
};
