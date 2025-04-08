import React from "react";
import {
  Menu,
  Home,
  PlaySquare,
  Library,
  History,
  Film,
  Clock,
  ThumbsUp,
  Music,
  User,
  Tv,
  TrendingUp,
  X,
  Video,
  Radio,
  PencilLine,
  Gamepad,
  Newspaper,
  Dumbbell,
  Sparkles,
} from "lucide-react";
import { SiYoutubeshorts } from "react-icons/si";
import SidebarItem from "./SidebarItem";

const subscriptions = [
  {
    id: "channel1",
    label: "TechCrunch",
    image: "https://placehold.co/30x30",
  },
  {
    id: "channel2",
    label: "Music Hub",
    image: "https://placehold.co/30x30",
  },
  {
    id: "channel3",
    label: "Travel Diaries",
    image: "https://placehold.co/30x30",
  },
  {
    id: "channel4",
    label: "Fitness Pro",
    image: "https://placehold.co/30x30",
  },
];

const sidebarSections = [
  {
    title: "",
    items: [
      { id: "home", icon: <Home />, label: "Home", route: "/" },
      {
        id: "shorts",
        icon: <SiYoutubeshorts className="text-xl" />,
        label: "Shorts",
      },
      { id: "subscriptions", icon: <PlaySquare />, label: "Subscriptions" },
    ],
  },
  {
    title: "YOU",
    items: [
      { id: "library", icon: <Library />, label: "Library" },
      { id: "history", icon: <History />, label: "History" },
      { id: "yourVideos", icon: <Film />, label: "Your videos" },
      { id: "watchlater", icon: <Clock />, label: "Watch later" },
      { id: "liked", icon: <ThumbsUp />, label: "Liked videos" },
    ],
  },
  {
    title: "Subscriptions",
    custom: "subscriptions",
  },
  {
    title: "Explore",
    items: [
      { id: "trending", icon: <TrendingUp />, label: "Trending" },
      { id: "ytMusic", icon: <Music />, label: "YouTube Music" },
      { id: "ytKids", icon: <User />, label: "YouTube Kids" },
      { id: "ytTv", icon: <Tv />, label: "YouTube TV" },
      { id: "gaming", icon: <Gamepad />, label: "Gaming" },
      { id: "news", icon: <Newspaper />, label: "News" },
      { id: "sports", icon: <Dumbbell />, label: "Sports" },
      { id: "fashionBeauty", icon: <Sparkles />, label: "Fashion & Beauty" },
    ],
  },
  {
    title: "Creator Studio",
    items: [
      {
        id: "studio",
        icon: <Video />,
        label: "Upload video",
        route: "/:id/upload",
      },
      { id: "live", icon: <Radio />, label: "Go live" },
      { id: "post", icon: <PencilLine />, label: "Create post" },
    ],
  },
];

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  mobileMenuOpen,
  setMobileMenuOpen,
  activeItem,
  setActiveItem,
  route,
}) {
  const renderSubscriptions = () => (
    <>
      {subscriptions.map((channel) => (
        <div
          key={channel.id}
          className={`flex items-center cursor-pointer p-2 rounded hover:bg-[#222] ${
            activeItem === channel.id ? "bg-[#222]" : ""
          }`}
          onClick={() => {
            setActiveItem(channel.id);
            setMobileMenuOpen(false);
          }}
        >
          <img
            src={channel.image}
            alt={channel.label}
            className="w-6 h-6 rounded-full mr-3"
          />
          {sidebarOpen && (
            <span className="text-sm text-white">{channel.label}</span>
          )}
          {!sidebarOpen && <span className="sr-only">{channel.label}</span>}
        </div>
      ))}
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-48" : "w-16"
        } hidden md:flex flex-col bg-[#0f0f0f]  transition-all duration-300`}
      >
        <div className="p-4 flex justify-center md:justify-start sticky top-0 bg-[#0f0f0f] z-10 border-b border-[#222] shadow-sm">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="text-white cursor-pointer" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-2">
          <nav className="flex flex-col space-y-4">
            {sidebarSections.map((section, idx) => (
              <div key={idx}>
                {section.title && sidebarOpen && (
                  <h4 className="text-xs uppercase text-gray-200 mb-2 px-2 font-semibold">
                    {section.title}
                  </h4>
                )}
                {section.custom === "subscriptions"
                  ? renderSubscriptions()
                  : section.items?.map((item) => (
                      <SidebarItem
                        key={item.id}
                        icon={item.icon}
                        label={item.label}
                        sidebarOpen={sidebarOpen}
                        active={activeItem === item.id}
                        route={item.route}
                        onClick={() => setActiveItem(item.id)}
                      />
                    ))}
                <div className="border-b border-[#333] my-3"></div>
              </div>
            ))}
          </nav>
          <div className="py-4 text-xs text-[#555] text-center">
            © {new Date().getFullYear()} Sahil Bhowmick | YouTube Clone.
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-[999] transition-all duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden flex`}
      >
        <div
          onClick={() => setMobileMenuOpen(false)}
          className={`flex-1 ${
            mobileMenuOpen ? "backdrop-blur-md" : ""
          } bg-black bg-opacity-50 transition-all duration-300`}
        ></div>

        <div
          className={`fixed top-0 left-0 h-full w-64 bg-[#0f0f0f] border-r border-[#222] p-4 flex flex-col transform ${
            mobileMenuOpen
              ? "translate-x-0 scale-100 opacity-100"
              : "-translate-x-full scale-95 opacity-0"
          } transition-all duration-300 ease-out`}
        >
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-semibold text-white">Menu</span>
            <button onClick={() => setMobileMenuOpen(false)}>
              <X className="text-white" size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <nav className="flex flex-col space-y-4">
              {sidebarSections.map((section, idx) => (
                <div key={idx}>
                  {section.title && (
                    <h4 className="text-xs uppercase text-gray-200 mb-2 px-2 font-semibold">
                      {section.title}
                    </h4>
                  )}
                  {section.custom === "subscriptions"
                    ? renderSubscriptions()
                    : section.items?.map((item) => (
                        <SidebarItem
                          key={item.id}
                          icon={item.icon}
                          label={item.label}
                          sidebarOpen={true}
                          route={item.route}
                          active={activeItem === item.id}
                          onClick={() => {
                            setActiveItem(item.id);
                            setMobileMenuOpen(false);
                          }}
                        />
                      ))}
                  <div className="border-b border-[#333] my-3"></div>
                </div>
              ))}
            </nav>
          </div>

          <div className="py-4 text-xs text-[#555] text-center">
            © {new Date().getFullYear()} Sahil Bhowmick | YouTube Clone.
          </div>
        </div>
      </div>
    </>
  );
}
