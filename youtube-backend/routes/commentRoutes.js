import { Router } from "express";
import {
  addComment,
  getCommentByVideoId,
  addReplyToComment,
  editCommentOrReply,
} from "../controllers/commentController.js";
import auth from "../middlewares/authentication.js";

const router = Router();

router.post("/comment", auth, addComment);
router.get("/comment/:videoId", getCommentByVideoId);
router.post("/comment/:commentId/reply", auth, addReplyToComment);
router.patch("/:commentId", auth, editCommentOrReply);

export default router;
