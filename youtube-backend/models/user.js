import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    channelName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    subscribers: {
      type: Number,
      default: 0,
    },
    subscribedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "video",
      },
    ],
    likedVideos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "video",
      },
    ],
    dislikedVideos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "video",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

export default User;
