import Video from "../models/video.js";

export const uploadVideo = async (req, res) => {
  try {
    const { title, description, videoLink, videoType, thumbnail } = req.body;

    if (!req.userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const videoUpload = await Video.create({
      user: req.userId,
      title,
      description,
      videoLink,
      videoType,
      thumbnail,
    });

    res.status(201).json({ success: true, videoUpload });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllVideo = async (req, res) => {
  try {
    const videos = await Video.find().populate(
      "user",
      "channelName profilePic userName createdAt"
    );
    res.status(200).json({ success: true, videos });
  } catch (error) {
    console.error("Fetch All Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id).populate(
      "user",
      "channelName profilePic userName createdAt"
    );
    if (!video) return res.status(404).json({ error: "Video not found" });

    res.status(200).json({ success: true, video });
  } catch (error) {
    console.error("Fetch By ID Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllVideoByUserID = async (req, res) => {
  try {
    const { userId } = req.params;
    const video = await Video.find({ user: userId }).populate(
      "user",
      "channelName profilePic userName createdAt about"
    );
    res.status(200).json({ success: true, video });
  } catch (error) {
    console.error("Fetch By UserID Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
