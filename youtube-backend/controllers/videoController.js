import Video from "../models/video.js";

// Upload a new video
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

// Get all videos
export const getAllVideo = async (req, res) => {
  try {
    const videos = await Video.find().populate(
      "user",
      "channelName profilePic userName subscribers isVerified createdAt"
    );
    res.status(200).json({ success: true, videos });
  } catch (error) {
    console.error("Fetch All Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get single video by ID
export const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id).populate(
      "user",
      "channelName profilePic userName subscribers isVerified createdAt"
    );
    if (!video) return res.status(404).json({ error: "Video not found" });

    res.status(200).json({ success: true, video });
  } catch (error) {
    console.error("Fetch By ID Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all videos uploaded by a specific user
export const getAllVideoByUserID = async (req, res) => {
  try {
    const { userId } = req.params;
    const video = await Video.find({ user: userId }).populate(
      "user",
      "channelName profilePic userName subscribers isVerified createdAt about"
    );
    res.status(200).json({ success: true, video });
  } catch (error) {
    console.error("Fetch By UserID Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Update video views
export const updateVideoViews = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedVideo = await Video.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!updatedVideo) {
      return res.status(404).json({ error: "Video not found" });
    }

    res.status(200).json({ success: true, updatedVideo });
  } catch (error) {
    console.error("Update Views Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get videos by category (videoType)
export const getVideosByCategory = async (req, res) => {
  try {
    const { type } = req.params;

    const videos = await Video.find({
      videoType: { $regex: new RegExp(type, "i") }, // Case-insensitive match
    }).populate(
      "user",
      "channelName profilePic userName subscribers isVerified createdAt"
    );

    res.status(200).json({ success: true, videos });
  } catch (error) {
    console.error("Fetch by Category Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
