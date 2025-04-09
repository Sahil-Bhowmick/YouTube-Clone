import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import connectDB from "./connection/connection.js";
import userRoutes from "./routes/userRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
// app.use(cors({ origin: "http://localhost:5173" ,"https://youtube-clone-frontend-p90d.onrender.com", credentials: true }));
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "https://youtube-clone-frontend-p90d.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


// Routes
app.use("/auth", userRoutes);
app.use("/api", videoRoutes);
app.use("/api", commentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
app
  .listen(port, () => {
    console.log(`🚀 Server is running at: http://localhost:${port}`);
    console.log(`📅 Started on: ${new Date().toLocaleString()}`);
  })
  .on("error", (err) => {
    console.error("❌ Server failed to start:", err.message);
  });
