import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Bell,
  ChevronDown,
  Video,
  ListVideo,
  Users,
  Info,
  PlaySquare,
  MessageCircle,
} from "lucide-react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const Profile = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [bellActive, setBellActive] = useState(false);
  const [activeTab, setActiveTab] = useState("videos");
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const bellRef = useRef(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchProfileData = async () => {
      axios
        .get(`http://localhost:4000/api/${id}/channel`)
        .then((res) => {
          setData(res.data.video);
          setUser(res.data.video[0]?.user);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setBellActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatNumber = (num) => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num?.toString();
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

  return (
    <div className="max-w-[1200px] mx-auto text-white bg-[#0F0F0F] p-4">
      {/* Banner */}
      <div className="w-full h-40 sm:h-56 bg-cover bg-center bg-[#181818] rounded-lg"></div>

      {/* Profile Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          {/* Profile Image */}
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gray-400 flex items-center justify-center -mt-10 sm:-mt-14 border-4 border-[#0F0F0F] overflow-hidden">
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={40} className="text-white" />
            )}
          </div>

          {/* Channel Details */}
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {user?.channelName}
            </h2>

            {/* Meta Info */}
            <p className="text-gray-400 text-sm mt-1">
              {user?.userName} • {formatNumber(user?.subscribers)} subscribers •{" "}
              {formatNumber(data.length)} videos
            </p>

            {/* About Section */}
            <p className="text-gray-300 text-sm mt-1">
              {user?.about ? user.about : "No about info available!"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mt-4 sm:mt-0">
          <button className="px-4 sm:px-5 py-2 bg-[#272727] text-white rounded-lg hover:bg-[#3D3D3D] transition cursor-pointer">
            Join
          </button>
          <button
            className={`px-4 sm:px-5 py-2 cursor-pointer rounded-lg font-medium transition ${
              subscribed
                ? "bg-[#272727] text-white hover:bg-[#3D3D3D]"
                : "bg-[#CC0000] text-white hover:bg-[#E60000]"
            }`}
            onClick={() => setSubscribed(!subscribed)}
          >
            {subscribed ? "Subscribed" : "Subscribe"}
          </button>

          {/* Bell Dropdown (Visible After Subscribing) */}
          {subscribed && (
            <div className="relative" ref={bellRef}>
              <button
                className="px-3 py-2 bg-[#272727] rounded-full flex items-center gap-1 hover:bg-[#3D3D3D] transition"
                onClick={() => setBellActive(!bellActive)}
              >
                <Bell size={20} />
                <ChevronDown size={16} />
              </button>
              {bellActive && (
                <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-[#181818] shadow-lg p-2 rounded-lg w-40 border border-[#3D3D3D] scale-100 sm:scale-105 transition-all duration-300 ease-in-out z-50">
                  <p className="cursor-pointer hover:bg-[#3D3D3D] p-1 rounded-lg text-center text-sm">
                    All Notifications
                  </p>
                  <p className="cursor-pointer hover:bg-[#3D3D3D] p-1 rounded-lg text-center text-sm">
                    Personalized Notifications
                  </p>
                  <p className="cursor-pointer hover:bg-[#3D3D3D] p-1 rounded-lg text-center text-sm">
                    None
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-[#3D3D3D] flex flex-wrap gap-4 sm:gap-6 px-4 text-[#AAAAAA] overflow-x-auto">
        {[
          { name: "Videos", icon: Video, key: "videos" },
          { name: "Playlists", icon: ListVideo, key: "playlists" },
          { name: "Posts", icon: MessageCircle, key: "posts" },
          { name: "Community", icon: Users, key: "community" },
          { name: "Channels", icon: PlaySquare, key: "channels" },
          { name: "About", icon: Info, key: "about" },
        ].map(({ name, icon: Icon, key }) => (
          <button
            key={key}
            className={`flex items-center gap-2 py-2 px-2 cursor-pointer transition ${
              activeTab === key
                ? "border-b-2 border-white text-white"
                : "hover:text-white"
            }`}
            onClick={() => setActiveTab(key)}
          >
            <Icon size={18} /> {name}
          </button>
        ))}
      </div>

      {/* Video Section */}
      {activeTab === "videos" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 cursor-pointer">
          {data.map((video, index) => (
            <Link
              to={`/watch/${video._id}`}
              key={index}
              className="block bg-[#181818] rounded-lg p-3 hover:bg-[#202020] transition"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-36 object-cover rounded-lg"
              />
              <h3 className="text-sm font-semibold mt-2 text-gray-100 hover:underline">
                {video.title}
              </h3>
              <p className="text-xs text-gray-400">
                {video.views} views • {getTimeAgo(video.createdAt)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
