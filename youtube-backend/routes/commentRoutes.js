import { Router } from "express";
import {
  addComment,
  getCommentByVideoId,
  addReplyToComment,
} from "../controllers/commentController.js";
import auth from "../middlewares/authentication.js";

const router = Router();

router.post("/comment", auth, addComment);
router.get("/comment/:videoId", getCommentByVideoId);
router.post("/comment/:commentId/reply", auth, addReplyToComment);
export default router;
