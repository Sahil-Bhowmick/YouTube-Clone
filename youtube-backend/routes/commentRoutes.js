import { Router } from "express";
import {
  addComment,
  getCommentByVideoId,
} from "../controllers/commentController.js";
import auth from "../middleware/authentication.js";

const router = Router();

router.post("/comment", auth, addComment);
router.get("/comment/:videoId", getCommentByVideoId);

export default router;
