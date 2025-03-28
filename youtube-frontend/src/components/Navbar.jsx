import React, { useState } from "react";
import { Menu, Search, Mic, Bell } from "lucide-react";
import YouTubeImg from "../assets/youtube.png";
import { Link } from "react-router-dom";

export default function Navbar({ setMobileMenuOpen }) {
  const [showProfileTooltip, setShowProfileTooltip] = useState(false);
  const [showNotificationTooltip, setShowNotificationTooltip] = useState(false);

  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-3  bg-[#0f0f0f] sticky top-0 z-10">
      {/* Left */}
      <div className="flex items-center space-x-4">
        <button onClick={() => setMobileMenuOpen(true)} className="md:hidden">
          <Menu className="text-white" />
        </button>
        <Link
          to={"/"}
          className="flex items-center space-x-1 relative cursor-pointer"
        >
          <img src={YouTubeImg} alt="YouTube" className="h-9" />
          <div className="relative hidden md:block">
            <span className="text-white text-xl font-semibold">YouTube</span>
            <span className="absolute text-[11px] text-[#aaa] top-[-5px] right-[-14px]">
              IN
            </span>
          </div>
        </Link>
      </div>

      {/* Middle - Search */}
      <div className="flex items-center flex-1 justify-end md:justify-center max-w-md mx-4">
        <div className="flex bg-[#121212] border border-[#303030] rounded-full overflow-hidden w-full focus-within:border-[#3ea6ff] transition-colors duration-300">
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-2 w-full bg-[#121212] text-sm outline-none text-white placeholder:text-[#aaa]"
          />
          <button className="bg-[#222] px-4 flex items-center justify-center cursor-pointer">
            <Search className="text-white" />
          </button>
        </div>
        <button className="hover:bg-[#222] p-2 rounded-full ml-2 cursor-pointer">
          <Mic className="text-white" />
        </button>
      </div>

      {/* Right - Icons */}
      <div className="flex items-center space-x-4 relative group">
        {/* Notification - Only on md+ */}
        <div className="relative hidden md:block">
          <button
            className="hover:bg-[#222] p-2 rounded-full cursor-pointer"
            onMouseEnter={() => setShowNotificationTooltip(true)}
            onMouseLeave={() => setShowNotificationTooltip(false)}
          >
            <Bell className="text-white" />
          </button>
          {showNotificationTooltip && (
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-[#333] text-xs text-white px-2 py-1 rounded shadow-md whitespace-nowrap">
              Notifications
            </div>
          )}
        </div>

        {/* Profile */}
        <div
          className="relative"
          onMouseEnter={() => setShowProfileTooltip(true)}
          onMouseLeave={() => setShowProfileTooltip(false)}
        >
          <img
            src="https://via.placeholder.com/30"
            alt="Profile"
            className="w-8 h-8 rounded-full cursor-pointer object-cover"
          />
          {showProfileTooltip && (
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-[#333] text-xs text-white px-2 py-1 rounded shadow-md whitespace-nowrap">
              Profile
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
