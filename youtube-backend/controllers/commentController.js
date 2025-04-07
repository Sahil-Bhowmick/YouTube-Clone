import mongoose from "mongoose";
import sanitizeHtml from "sanitize-html";
import Comment from "../models/comment.js";

// Add a new comment
export const addComment = async (req, res) => {
  try {
    const { video, message } = req.body;

    if (!video || !message) {
      return res
        .status(400)
        .json({ error: "Video ID and message are required." });
    }

    if (!mongoose.Types.ObjectId.isValid(video)) {
      return res.status(400).json({ error: "Invalid video ID." });
    }

    const sanitizedMessage = sanitizeHtml(message);

    const newComment = new Comment({
      user: req.userId,
      video,
      message: sanitizedMessage,
    });

    await newComment.save();

    const populatedComment = await Comment.findById(newComment._id).populate(
      "user",
      "username email"
    );

    res.status(201).json({
      message: "Comment added successfully",
      comment: populatedComment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all comments for a specific video
export const getCommentByVideoId = async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ error: "Invalid or missing video ID." });
    }

    const comments = await Comment.find({ video: videoId })
      .sort({ createdAt: -1 }) // Sort newest first
      .populate("user", "channelName userName email profilePic createdAt");

    res.status(200).json({ comments });
  } catch (error) {
    console.error("Error getting comments:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Add a reply to a comment
export const addReplyToComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { message } = req.body;

    if (!message || !commentId) {
      return res.status(400).json({ error: "Comment ID and message required" });
    }

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ error: "Invalid comment ID" });
    }

    const sanitizedMessage = sanitizeHtml(message);

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const reply = {
      user: req.userId,
      message: sanitizedMessage,
    };

    comment.replies.push(reply);
    await comment.save();

    // Get the last added reply with user populated
    const populatedComment = await Comment.findById(commentId)
      .populate("user", "channelName userName email profilePic")
      .populate("replies.user", "channelName userName email profilePic");

    res.status(201).json({
      message: "Reply added successfully",
      reply: populatedComment.replies.at(-1), // latest reply
    });
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({ error: "Server error" });
  }
};
