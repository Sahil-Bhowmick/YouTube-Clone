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
  CheckCircle,
  SortAsc,
} from "lucide-react";
import { Link } from "react-router-dom";

const commentsData = [
  { id: 1, user: "John Doe", text: "Awesome video!" },
  { id: 2, user: "Jane Smith", text: "Loved the editing!" },
  { id: 3, user: "Alex", text: "Very informative." },
  { id: 4, user: "Sam", text: "Great content as always." },
  { id: 5, user: "Mike", text: "This is super helpful." },
];

const VideoPage = () => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [comment, setComment] = useState("");
  const [focused, setFocused] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [replies, setReplies] = useState({});
  const [showFullDescription, setShowFullDescription] = useState(false);
  const dropdownRef = useRef(null);

  const [user, setUser] = useState({
    isLoggedIn: false,
    photoURL: "https://randomuser.me/api/portraits/men/75.jpg", // Replace with dynamic image
  });

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

  const visibleComments = showAllComments
    ? commentsData
    : commentsData.slice(0, 3);

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[#0f0f0f] text-white overflow-hidden">
      {/* ---------- Left Section (Video + Comments) ---------- */}
      <div className="w-full lg:w-[70%] flex flex-col px-4 py-4 space-y-4">
        {/* Video */}
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="YouTube Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>

        {/* Title */}
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold leading-tight">
          Sample YouTube Clone Video - Fully Responsive
        </h1>

        {/* Channel Info + Actions */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          {/* Channel Info */}
          <div className="flex items-center gap-3">
            <Link
              to={"/user/7878"}
              className="w-12 h-12 cursor-pointer rounded-full bg-gray-700 flex items-center justify-center overflow-hidden"
            >
              {user.isLoggedIn && user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="User Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User className="text-white w-6 h-6" />
              )}
            </Link>
            <div>
              <div className="flex items-center gap-1">
                <h3 className="font-semibold text-sm cursor-pointer">
                  Channel Name
                </h3>
                <CheckCircle className="text-blue-500 w-4 h-4 cursor-pointer" />
              </div>
              <p className="text-xs text-gray-400">2.3M subscribers</p>
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
              <ThumbsUp size={18} /> 3.4K
              <div className="w-[1px] h-5 bg-gray-600 mx-2" />
              <ThumbsDown size={18} />
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
          <p>
            {showFullDescription
              ? "This is a sample description with more info, timestamps, links, hashtags, and all the details you usually see on YouTube. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla officiis molestias unde illum."
              : "This is a sample description with more info, timestamps, links..."}
          </p>
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-blue-400 text-xs hover:underline"
            type="button"
          >
            {showFullDescription ? "Show less" : "Show more"}
          </button>
        </div>

        {/* Comments */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <MessageSquare size={20} /> {commentsData.length} Comments
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
          {visibleComments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-3 mt-4 hover:bg-[#1c1c1c] p-2 rounded-xl transition"
            >
              <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center">
                <User size={16} />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{comment.user}</p>
                  <span className="text-xs text-gray-500">• 1 day ago</span>
                </div>
                <p className="text-sm text-gray-300">{comment.text}</p>

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
                    onClick={() => toggleReplyBox(comment.id)}
                    type="button"
                    className="hover:underline"
                  >
                    {replies[comment.id]?.show ? "Hide reply" : "Reply"}
                  </button>
                </div>

                {replies[comment.id]?.show && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={replies[comment.id]?.input || ""}
                      onChange={(e) =>
                        handleReplyChange(comment.id, e.target.value)
                      }
                      placeholder="Reply..."
                      className="flex-1 bg-transparent border-b border-gray-600 focus:outline-none focus:border-white text-sm text-white placeholder-gray-400"
                    />
                    <button
                      onClick={() => handleReplySubmit(comment.id)}
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
              <div className="w-32 h-20 bg-gray-600 flex items-center justify-center rounded-lg">
                <PlayCircle size={24} />
              </div>
              <div className="flex flex-col justify-between">
                <h3 className="text-sm font-semibold leading-snug">
                  Recommended Video {index + 1}
                </h3>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  Channel Name
                  <span className="relative group">
                    <CheckCircle size={12} className="text-blue-500" />

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
