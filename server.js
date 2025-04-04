import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Import database connection
// import("./Connection/conn.js");

// Import Routes
// import AuthRoutes from "./Routes/user.js";
// import VideoRoutes from "./Routes/video.js";
// import CommentRoutes from "./Routes/comment.js";

const app = express();
const port = 4000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Your React app's URL
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Define Routes
// app.use("/auth", AuthRoutes);
// app.use("/api", VideoRoutes);
// app.use("/commentApi", CommentRoutes);

// Start Server with Improved Logging
app
  .listen(port, () => {
    console.log(`🚀 Server is running at: http://localhost:${port}`);
    console.log(`📅 Started on: ${new Date().toLocaleString()}`);
  })
  .on("error", (err) => {
    console.error("❌ Server failed to start:", err.message);
  });
