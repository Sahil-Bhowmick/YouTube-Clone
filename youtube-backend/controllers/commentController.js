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
      "username email profilePic"
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

// Edit Comment
export const editCommentOrReply = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { replyId, message } = req.body;

    if (!message || !commentId) {
      return res
        .status(400)
        .json({ error: "Message and Comment ID are required." });
    }

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ error: "Invalid comment ID." });
    }

    const sanitizedMessage = sanitizeHtml(message);

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    // Check if it's a reply edit
    if (replyId) {
      if (!mongoose.Types.ObjectId.isValid(replyId)) {
        return res.status(400).json({ error: "Invalid reply ID." });
      }

      const reply = comment.replies.id(replyId);
      if (!reply) {
        return res.status(404).json({ error: "Reply not found." });
      }

      if (reply.user.toString() !== req.userId) {
        return res
          .status(403)
          .json({ error: "Unauthorized to edit this reply." });
      }

      reply.message = sanitizedMessage;
      reply.editedAt = new Date();

      await comment.save();

      return res.status(200).json({
        message: "Reply updated successfully",
        updatedReply: reply,
      });
    }

    // Else it's a comment edit
    if (comment.user.toString() !== req.userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to edit this comment." });
    }

    comment.message = sanitizedMessage;
    comment.editedAt = new Date();

    await comment.save();

    return res.status(200).json({
      message: "Comment updated successfully",
      updatedComment: comment,
    });
  } catch (error) {
    console.error("Error editing comment or reply:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
