import React, { useState, useEffect, useRef } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  MoreHorizontal,
  Heart,
  Scissors,
  Bookmark,
  Flag,
  MessageSquare,
  PlayCircle,
  User,
  SortAsc,
} from "lucide-react";
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";

const commentsData = [
  { id: 1, user: "John Doe", text: "Awesome video!" },
  { id: 2, user: "Jane Smith", text: "Loved the editing!" },
  { id: 3, user: "Alex", text: "Very informative." },
  { id: 4, user: "Sam", text: "Great content as always." },
  { id: 5, user: "Mike", text: "This is super helpful." },
];

const VideoPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [comment, setComment] = useState("");
  const [focused, setFocused] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [replies, setReplies] = useState({});
  const [showFullDescription, setShowFullDescription] = useState(false);
  const dropdownRef = useRef(null);
  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const { id } = useParams();

  // Fetching Video Data

  useEffect(() => {
    const fetchVideoById = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/getVideoById/${id}`
        );
        setData(res?.data?.video);
        setVideoUrl(res?.data?.video?.videoLink || "");
      } catch (err) {
        console.error(err);
      }
    };

    const getCommentByVideoId = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/comment/${id}`);
        setComments(res?.data?.comments || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchVideoById();
    getCommentByVideoId();
  }, [id]);

  const isYouTubeLink = (url) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const getYouTubeVideoId = (url) => {
    try {
      const urlObj = new URL(url || "");
      return urlObj.searchParams.get("v");
    } catch (err) {
      return null;
    }
  };
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    for (let i = 0; i < intervals.length; i++) {
      const interval = intervals[i];
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
      }
    }

    return "Just now";
  };

  // handle outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleReplyChange = (id, value) => {
    setReplies((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        input: value,
      },
    }));
  };

  const handleReplySubmit = (id) => {
    if (replies[id]?.input?.trim()) {
      alert(`Reply to comment ${id}: ${replies[id]?.input}`);
      setReplies((prev) => ({
        ...prev,
        [id]: { show: false, input: "" },
      }));
    }
  };

  const toggleReplyBox = (id) => {
    setReplies((prev) => ({
      ...prev,
      [id]: {
        show: !prev[id]?.show,
        input: prev[id]?.input || "",
      },
    }));
  };

  const formatNumber = (num) => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num?.toString();
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[#0f0f0f] text-white overflow-hidden">
      {/* ---------- Left Section (Video + Comments) ---------- */}
      <div className="w-full lg:w-[70%] flex flex-col px-4 py-4 space-y-4">
        {/* Video */}
        {videoUrl ? (
          isYouTubeLink(videoUrl) ? (
            <iframe
              className="w-full h-[500px] rounded-xl"
              src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                videoUrl
              )}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={videoUrl}
              className="w-full h-[500px] rounded-xl bg-black"
              controls
              autoPlay
            />
          )
        ) : (
          <div className="w-full h-[500px] flex items-center justify-center text-gray-400">
            Loading video...
          </div>
        )}

        {/* Title */}
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold leading-tight">
          {data?.title}
        </h1>

        {/* Channel Info + Actions */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          {/* Channel Info */}
          <div className="flex items-center gap-3">
            <Link
              to={`/user/${data?.user?._id}`}
              className="w-12 h-12 cursor-pointer rounded-full bg-gray-700 flex items-center justify-center overflow-hidden"
            >
              {data?.user?.profilePic ? (
                <img
                  src={data.user.profilePic}
                  alt="User Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-700 rounded-full">
                  <User className="text-white w-6 h-6" />
                </div>
              )}
            </Link>
            <div>
              <div className="flex items-center gap-2 relative group">
                <Link to={`/user/${data?.user?._id}`}>
                  <h3 className="font-semibold text-sm cursor-pointer">
                    {data?.user?.channelName}
                  </h3>
                </Link>

                {data?.user?.isVerified && (
                  <div className="relative flex items-center group ml-1">
                    <FaCheckCircle className="text-blue-500 w-4 h-4 cursor-pointer" />

                    {/* Tooltip */}
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                      Verified
                    </span>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-400">
                {formatNumber(data?.user?.subscribers)} subscribers
              </p>
            </div>
            <button
              type="button"
              className="ml-4 px-4 py-1 cursor-pointer bg-white text-black rounded-full hover:scale-105 transition text-sm font-medium"
            >
              Subscribe
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap text-gray-300 text-[15px] font-medium">
            {/* Like / Dislike */}
            <button
              type="button"
              className="flex items-center gap-2 cursor-pointer bg-[#272727] hover:bg-[#3c3c3c] px-4 py-2 rounded-full transition"
            >
              <ThumbsUp size={18} /> {data?.like}
              <div className="w-[1px] h-5 bg-gray-600 mx-2" />
              <ThumbsDown size={18} />
              {data?.dislike}
            </button>

            {/* Share */}
            <button
              type="button"
              className="flex items-center gap-2 cursor-pointer bg-[#272727] hover:bg-[#3c3c3c] px-4 py-2 rounded-full transition"
            >
              <Share2 size={18} /> Share
            </button>

            {/* Download */}
            <button
              type="button"
              className="flex items-center gap-2 cursor-pointer bg-[#272727] hover:bg-[#3c3c3c] px-4 py-2 rounded-full transition"
            >
              <Download size={18} /> Download
            </button>
            {/* More Dropdown */}
            <div className="relative inline-block text-left" ref={dropdownRef}>
              {/* More Button */}
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="bg-[#272727] hover:bg-[#3c3c3c] cursor-pointer p-3 rounded-full transition"
              >
                <MoreHorizontal size={18} />
              </button>

              {/* Dropdown */}
              {showMoreMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[#272727] rounded-md shadow-lg py-2 z-20">
                  <button
                    onClick={() => setShowMoreMenu(false)}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-[#3c3c3c]"
                  >
                    <Heart size={18} /> Thanks
                  </button>
                  <button
                    onClick={() => setShowMoreMenu(false)}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-[#3c3c3c]"
                  >
                    <Scissors size={18} /> Clip
                  </button>
                  <button
                    onClick={() => setShowMoreMenu(false)}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-[#3c3c3c]"
                  >
                    <Bookmark size={18} /> Save
                  </button>
                  <button
                    onClick={() => setShowMoreMenu(false)}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-[#3c3c3c]"
                  >
                    <Flag size={18} /> Report
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <hr className="border-gray-700" />

        {/* Expandable Description */}
        <div className="bg-[#1c1c1c] p-3 rounded-lg text-sm text-gray-300 space-y-1 leading-relaxed">
          {/* Views and Created At */}
          <div className="text-gray-400 text-xs mb-1">
            {formatNumber(data?.views)} views • {getTimeAgo(data?.createdAt)}
          </div>

          {/* Description */}
          <p>
            {showFullDescription
              ? data?.description
              : `${data?.description?.slice(0, 60)}...`}
          </p>

          {/* Toggle Button */}
          {data?.description?.length > 60 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-blue-400 text-xs hover:underline"
              type="button"
            >
              {showFullDescription ? "Show less" : "Show more"}
            </button>
          )}
        </div>

        {/* Comments */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <MessageSquare size={20} /> {comments.length} Comments
          </h2>

          {/* Sort By */}
          <div className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer hover:underline">
            <SortAsc size={16} /> Sort by
          </div>

          {/* Add Comment */}
          <div className="flex flex-col gap-2 w-full">
            {/* Avatar + Input */}
            <div className="flex gap-3 items-start">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
                <User size={20} className="text-white" />
              </div>

              {/* Input */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={comment}
                  onFocus={() => setFocused(true)}
                  onBlur={() => !comment && setFocused(false)}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-transparent border-b border-[#3f3f3f] focus:outline-none focus:border-[#aaa] text-[15px] text-white placeholder-gray-400 py-2 transition"
                />

                {/* Action Buttons */}
                {focused && (
                  <div className="flex justify-end gap-4 md:gap-6 mt-3 transition-all">
                    <button
                      onClick={() => {
                        setComment("");
                        setFocused(false);
                      }}
                      className="text-sm text-[#aaa] font-medium rounded-full px-5 py-2.5 hover:bg-[#3f3f3f] hover:text-white transition"
                    >
                      Cancel
                    </button>

                    <button
                      disabled={!comment.trim()}
                      onClick={() => {
                        console.log("Comment:", comment);
                        setComment("");
                        setFocused(false);
                      }}
                      className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${
                        comment.trim()
                          ? "bg-[#3ea6ff] text-black hover:bg-[#65b7ff]"
                          : "bg-[#3f3f3f] text-[#888] cursor-not-allowed"
                      }`}
                    >
                      Comment
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Comments List */}
          {comments.map((comment, index) => (
            <div
              key={comment?._id}
              className="flex gap-3 mt-4 hover:bg-[#1c1c1c] p-2 rounded-xl transition"
            >
              {/* Profile Picture or Fallback Icon */}
              <div className="w-9 h-9 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center">
                {comment?.user?.profilePic ? (
                  <img
                    src={comment.user.profilePic}
                    alt="User avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={16} />
                )}
              </div>

              <div className="flex-1 space-y-1">
                {/* User Info and Date */}
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">
                    {comment?.user?.channelName || comment?.user?.userName}
                  </p>
                  <span className="text-xs text-gray-500">
                    • {getTimeAgo(comment.createdAt)}
                  </span>
                </div>

                {/* Comment Message */}
                <p className="text-sm text-gray-300">{comment?.message}</p>

                {/* Buttons: Like, Dislike, Reply */}
                <div className="flex items-center gap-4 text-gray-400 mt-1 text-sm">
                  <button
                    type="button"
                    className="flex items-center gap-1 hover:text-white"
                  >
                    <ThumbsUp size={14} />
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1 hover:text-white"
                  >
                    <ThumbsDown size={14} />
                  </button>
                  <button
                    onClick={() => toggleReplyBox(comment._id)}
                    type="button"
                    className="hover:underline"
                  >
                    {replies[comment._id]?.show ? "Hide reply" : "Reply"}
                  </button>
                </div>

                {/* Reply Input */}
                {replies[comment._id]?.show && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={replies[comment._id]?.input || ""}
                      onChange={(e) =>
                        handleReplyChange(comment._id, e.target.value)
                      }
                      placeholder="Reply..."
                      className="flex-1 bg-transparent border-b border-gray-600 focus:outline-none focus:border-white text-sm text-white placeholder-gray-400"
                    />
                    <button
                      onClick={() => handleReplySubmit(comment._id)}
                      type="button"
                      className="text-blue-400 text-xs hover:underline"
                    >
                      Reply
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Show More / Less */}
          {commentsData.length > 3 && (
            <button
              onClick={() => setShowAllComments(!showAllComments)}
              className="text-blue-400 text-xs hover:underline"
              type="button"
            >
              {showAllComments ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      </div>

      {/* ---------- Right Section (Recommended Videos) ---------- */}
      <div className="hidden lg:block w-[30%] bg-[#0f0f0f] p-4">
        <h2 className="font-semibold text-lg mb-4">Recommended</h2>
        <div className="space-y-4">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="flex gap-2 cursor-pointer hover:bg-[#1c1c1c] p-2 rounded-lg transition"
            >
              <div className="relative w-32 h-20 rounded-lg overflow-hidden group shadow-md">
                <img
                  src="https://img.freepik.com/free-vector/flat-spring-youtube-channel-art_23-2149268975.jpg?ga=GA1.1.957652596.1743933187&semt=ais_hybrid&w=740"
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <PlayCircle size={32} className="text-white" />
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <h3 className="text-sm font-semibold leading-snug">
                  Recommended Video {index + 1}
                </h3>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  Channel Name
                  <span className="relative group">
                    <FaCheckCircle size={12} className="text-blue-500" />

                    {/* Tooltip positioned on top of icon */}
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-0.5 bg-[#272727] text-white text-[10px] px-2 py-[2px] rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-50">
                      Verified
                    </span>
                  </span>
                </p>

                <p className="text-xs text-gray-400">1M views • 2 days ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
