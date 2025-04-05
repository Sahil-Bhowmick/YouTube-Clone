import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./connection/connection.js";
import userRoutes from "./routes/userRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";

const app = express();
const port = 4000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Define Routes
app.use("/auth", userRoutes);
app.use("/api", videoRoutes);
// app.use("/commentApi", commentRoutes);

// Start Server with Improved Logging
app
  .listen(port, () => {
    console.log(`🚀 Server is running at: http://localhost:${port}`);
    console.log(`📅 Started on: ${new Date().toLocaleString()}`);
  })
  .on("error", (err) => {
    console.error("❌ Server failed to start:", err.message);
  });
