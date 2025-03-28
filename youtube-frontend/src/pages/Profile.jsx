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

const Profile = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [bellActive, setBellActive] = useState(false);
  const [activeTab, setActiveTab] = useState("videos");
  const bellRef = useRef(null);

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

  const dummyVideos = [
    {
      title: "React Tutorial for Beginners",
      views: "1.5M",
      time: "2 days ago",
    },
    { title: "Advanced CSS Tricks", views: "900K", time: "1 week ago" },
    { title: "JavaScript ES6 Features", views: "700K", time: "3 weeks ago" },
    { title: "Tailwind CSS Crash Course", views: "1.2M", time: "1 month ago" },
  ];

  return (
    <div className="max-w-[1200px] mx-auto text-white bg-[#0F0F0F] p-4">
      {/* Banner */}
      <div className="w-full h-40 sm:h-56 bg-cover bg-center bg-[#181818] rounded-lg"></div>

      {/* Profile Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          {/* Profile Image */}
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gray-400 flex items-center justify-center -mt-10 sm:-mt-14 border-4 border-[#0F0F0F]">
            <User size={40} className="text-white" />
          </div>

          {/* Channel Details */}
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold">Channel Name</h2>
            <p className="text-[#AAAAAA] text-sm">
              @channel_handle • 1.2M subscribers • 100 videos
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
          {dummyVideos.map((video, index) => (
            <div key={index} className="bg-[#181818] rounded-lg p-3">
              <div className="w-full h-36 bg-gray-600 rounded-lg"></div>
              <h3 className="text-sm font-semibold mt-2">{video.title}</h3>
              <p className="text-xs text-[#AAAAAA]">
                {video.views} views • {video.time}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
