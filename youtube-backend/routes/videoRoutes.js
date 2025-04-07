import { Router } from "express";
import {
  uploadVideo,
  getAllVideo,
  getVideoById,
  getAllVideoByUserID,
  updateVideoViews,
  getVideosByCategory,
} from "../controllers/videoController.js";
import auth from "../middlewares/authentication.js";

const router = Router();

// Routes
router.post("/video", auth, uploadVideo);
router.get("/allVideo", getAllVideo);
router.get("/getVideoById/:id", getVideoById);
router.get("/:userId/channel", getAllVideoByUserID);
router.put("/video/views/:id", updateVideoViews);
router.get("/category/:type", getVideosByCategory);

export default router;
