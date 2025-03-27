import React, { useState } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Save,
  MoreHorizontal,
  MessageSquare,
  PlayCircle,
  User,
} from "lucide-react";

const commentsData = [
  { id: 1, user: "John Doe", text: "Awesome video!" },
  { id: 2, user: "Jane Smith", text: "Loved the editing!" },
  { id: 3, user: "Alex", text: "Very informative." },
  { id: 4, user: "Sam", text: "Great content as always." },
  { id: 5, user: "Mike", text: "This is super helpful." },
];

const VideoPage = () => {
  const [showAllComments, setShowAllComments] = useState(false);
  const [replies, setReplies] = useState({});
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleReplyChange = (id, value) => {
    setReplies((prev) => ({ ...prev, [id]: value }));
  };

  const handleReplySubmit = (id) => {
    alert(`Reply to comment ${id}: ${replies[id] || ""}`);
    setReplies((prev) => ({ ...prev, [id]: "" }));
  };

  const visibleComments = showAllComments
    ? commentsData
    : commentsData.slice(0, 3);

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[#0f0f0f] text-white">
      {/* Video & Comments */}
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
        <h1 className="text-xl sm:text-2xl font-semibold">
          Sample YouTube Clone Video - Fully Responsive
        </h1>

        {/* Channel + Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
              <User />
            </div>
            <div>
              <h3 className="font-semibold">Channel Name</h3>
              <p className="text-sm text-gray-400">2.3M subscribers</p>
            </div>
            <button className="ml-4 px-4 py-1 bg-white text-black rounded-full hover:scale-105 transition">
              Subscribe
            </button>
          </div>

          <div className="flex items-center gap-4 flex-wrap text-gray-300">
            <button className="flex items-center gap-1 hover:bg-gray-800 px-2 py-1 rounded-full transition">
              <ThumbsUp size={18} /> 3.4K
            </button>
            <button className="flex items-center gap-1 hover:bg-gray-800 px-2 py-1 rounded-full transition">
              <ThumbsDown size={18} />
            </button>
            <button className="flex items-center gap-1 hover:bg-gray-800 px-2 py-1 rounded-full transition">
              <Share2 size={18} /> Share
            </button>
            <button className="flex items-center gap-1 hover:bg-gray-800 px-2 py-1 rounded-full transition">
              <Save size={18} /> Save
            </button>
            <button className="hover:bg-gray-800 p-2 rounded-full transition">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>

        {/* Expandable Description */}
        <div className="bg-[#1c1c1c] p-3 rounded-lg text-sm text-gray-300 space-y-1">
          <p>
            {showFullDescription
              ? "This is a sample description with more info, timestamps, links, hashtags, and all the details you usually see on YouTube. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla officiis molestias unde illum."
              : "This is a sample description with more info, timestamps, links..."}
          </p>
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-blue-400 text-xs hover:underline"
          >
            {showFullDescription ? "Show less" : "Show more"}
          </button>
        </div>

        {/* Comments */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <MessageSquare size={20} /> {commentsData.length} Comments
          </h2>

          {/* Add Comment */}
          <div className="flex gap-3 items-start">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <User />
            </div>
            <input
              type="text"
              placeholder="Add a comment..."
              className="w-full bg-transparent border-b border-gray-600 focus:outline-none focus:border-white text-sm text-white placeholder-gray-400 py-2"
            />
          </div>

          {/* Comments List */}
          {visibleComments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-3 mt-4 hover:bg-[#1c1c1c] p-2 rounded-xl transition"
            >
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center">
                <User size={16} />
              </div>

              {/* Comment Content */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{comment.user}</p>
                  <span className="text-xs text-gray-500">• 1 day ago</span>
                </div>
                <p className="text-sm text-gray-300">{comment.text}</p>

                {/* Like / Dislike / Reply */}
                <div className="flex items-center gap-4 text-gray-400 mt-1 text-sm">
                  <button className="flex items-center gap-1 hover:text-white">
                    <ThumbsUp size={14} />
                  </button>
                  <button className="flex items-center gap-1 hover:text-white">
                    <ThumbsDown size={14} />
                  </button>
                  <button
                    onClick={() =>
                      setReplies((prev) => ({
                        ...prev,
                        [comment.id]: !prev[comment.id],
                      }))
                    }
                    className="hover:underline"
                  >
                    {replies[comment.id] ? "Hide reply" : "Reply"}
                  </button>
                </div>

                {/* Reply Box */}
                {replies[comment.id] && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={replies[comment.id + "_input"] || ""}
                      onChange={(e) =>
                        setReplies((prev) => ({
                          ...prev,
                          [comment.id + "_input"]: e.target.value,
                        }))
                      }
                      placeholder="Reply..."
                      className="flex-1 bg-transparent border-b border-gray-600 focus:outline-none focus:border-white text-sm text-white placeholder-gray-400"
                    />
                    <button
                      onClick={() => handleReplySubmit(comment.id)}
                      className="text-sm text-blue-400 hover:underline"
                    >
                      Reply
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Show More */}
          {commentsData.length > 3 && (
            <button
              onClick={() => setShowAllComments(!showAllComments)}
              className="text-blue-400 hover:underline"
            >
              {showAllComments ? "Show less" : "Show more comments"}
            </button>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-[30%] px-2 py-4 space-y-4 overflow-y-auto">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="flex gap-2 cursor-pointer hover:bg-[#1c1c1c] p-2 rounded-lg transition-transform hover:scale-[1.01]"
          >
            <div className="w-40 h-24 bg-gray-700 flex items-center justify-center rounded-md overflow-hidden relative">
              <img
                src={`https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg`}
                alt="Recommended Thumbnail"
                className="w-full h-full object-cover"
              />
              <PlayCircle className="absolute text-white w-8 h-8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="flex-1 space-y-1">
              <p className="font-semibold text-sm line-clamp-2">
                Recommended Video {i + 1} with longer title maybe
              </p>
              <p className="text-xs text-gray-400">
                Channel Name • 120K views • 1 day ago
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoPage;
