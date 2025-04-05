import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = "your_jwt_secret_key"; // Replace with dotenv in production

const cookieOptions = {
  httpOnly: true,
  secure: false, // Set to true in production
  sameSite: "Lax",
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
      .json({ message: "User registered successfully", user: userData });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// SIGNIN Controller
export const signIn = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const user = await User.findOne({ userName }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    const { password: _, ...userData } = user._doc;

    res
      .cookie("token", token, cookieOptions)
      .json({ message: "Login successful", user: userData, token });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// LOGOUT Controller
export const logout = (req, res) => {
  res
    .clearCookie("token", cookieOptions)
    .json({ message: "Logged out successfully" });
};
