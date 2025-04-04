import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  Search,
  Mic,
  Bell,
  Video,
  Radio,
  PlusCircle,
  PencilLine,
  User,
  Settings,
  LogOut,
  LogIn,
} from "lucide-react";
import YouTubeImg from "../assets/youtube.png";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ setMobileMenuOpen }) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationTooltip, setShowNotificationTooltip] = useState(false);
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const profileRef = useRef(null);
  const createRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (createRef.current && !createRef.current.contains(event.target)) {
        setShowCreateDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDropdownClick = (path) => {
    setShowProfileDropdown(false);
    navigate(path);
  };

  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-3 bg-[#0f0f0f] sticky top-0 z-[999]">
      {/* Left */}
      <div className="flex items-center space-x-4">
        <button onClick={() => setMobileMenuOpen(true)} className="md:hidden">
          <Menu className="text-white" />
        </button>
        <Link to={"/"} className="flex items-center space-x-1 cursor-pointer">
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
      <div className="flex items-center space-x-4 relative">
        {/* Create Button - Dropdown */}
        <div ref={createRef} className="relative hidden md:block">
          <div className="group relative">
            <button
              className="hover:bg-[#222] p-2 rounded-full cursor-pointer relative"
              onClick={() => setShowCreateDropdown(!showCreateDropdown)}
            >
              {/* Main Video Icon */}
              <Video className="text-white w-6 h-6" />
              {/* Small Plus Icon Overlay */}
              <PlusCircle className="text-white w-3 h-3 absolute bottom-0 right-0 bg-[#0f0f0f] rounded-full" />
            </button>
            {/* Tooltip */}
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-[#333] text-xs text-white px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Create
            </div>
          </div>
          {showCreateDropdown && (
            <div className="absolute top-12 right-0 w-56 bg-[#333] text-white text-sm rounded-lg shadow-lg overflow-hidden z-[999]">
              <Link to={"/:id/upload"}>
                <button
                  className="flex items-center space-x-2 px-4 py-3 w-full text-left hover:bg-[#444]"
                  onClick={() => {
                    setShowCreateDropdown(false);
                    navigate("/:id/upload");
                  }}
                >
                  <Video className="w-5 h-5" />
                  <span>Upload Video</span>
                </button>
              </Link>
              <button
                className="flex items-center space-x-2 px-4 py-3 w-full text-left hover:bg-[#444]"
                onClick={() => {
                  setShowCreateDropdown(false);
                  navigate("/live");
                }}
              >
                <Radio className="w-5 h-5" />
                <span>Go Live</span>
              </button>
              <button
                className="flex items-center space-x-2 px-4 py-3 w-full text-left hover:bg-[#444]"
                onClick={() => {
                  setShowCreateDropdown(false);
                  navigate("/create-post");
                }}
              >
                <PencilLine className="w-5 h-5" />
                <span>Create Post</span>
              </button>
            </div>
          )}
        </div>

        {/* Notification */}
        <div className="relative hidden md:block">
          <button
            className="hover:bg-[#222] p-2 rounded-full cursor-pointer"
            onMouseEnter={() => setShowNotificationTooltip(true)}
            onMouseLeave={() => setShowNotificationTooltip(false)}
          >
            <Bell className="text-white" />
          </button>
          {showNotificationTooltip && (
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-[#333] text-xs text-white px-2 py-1 rounded shadow-md whitespace-nowrap z-[999]">
              Notifications
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
            <img
              src="https://img.freepik.com/premium-photo/color-user-icon-white-background_961147-8.jpg?semt=ais_hybrid"
              alt="Profile"
              className="w-8 h-8 rounded-full cursor-pointer object-cover"
            />
          </button>
          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-[#333] text-white text-sm rounded shadow-lg overflow-hidden z-[999]">
              {isLoggedIn ? (
                <>
                  <button
                    className="flex items-center px-4 py-2 w-full text-left hover:bg-[#444]"
                    onClick={() => handleDropdownClick("/user/7878")}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Your Channel
                  </button>
                  <button
                    className="flex items-center px-4 py-2 w-full text-left hover:bg-[#444]"
                    onClick={() => handleDropdownClick("/")}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </button>
                  <hr className="border-[#444]" />
                  <button
                    className="flex items-center w-full text-left px-4 py-2 hover:bg-[#444]"
                    onClick={() => {
                      setIsLoggedIn(false);
                      setShowProfileDropdown(false);
                      navigate("/");
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  className="flex items-center w-full text-left px-4 py-2 hover:bg-[#444]"
                  onClick={() => {
                    handleDropdownClick("/");
                    navigate("/auth");
                  }}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In / Sign Up
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
