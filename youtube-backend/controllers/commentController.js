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

    const newComment = new Comment({
      user: req.user.id, // Assuming `req.user.id` is set from authentication middleware
      video,
      message,
    });

    await newComment.save();

    res
      .status(201)
      .json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all comments for a specific video
export const getCommentByVideoId = async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!videoId) {
      return res.status(400).json({ error: "Video ID is required." });
    }

    const comments = await Comment.find({ video: videoId }).populate(
      "user",
      "username email"
    );

    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
