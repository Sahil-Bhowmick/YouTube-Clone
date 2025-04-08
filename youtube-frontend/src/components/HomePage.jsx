import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

export default function HomePage() {
  const [data, setData] = useState([]);
  const [chunkSize, setChunkSize] = useState(10);
  const [page, setPage] = useState(0);
  const [videoCount, setVideoCount] = useState(20);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const loaderRef = useRef(null);

  const categories = [
    "All",
    "Music",
    "Live",
    "Gaming",
    "Education",
    "News",
    "Sports",
    "Movies",
    "Fashion",
    "Learning",
    "Podcasts",
    "Technology",
    "Travel",
    "Science",
    "Comedy",
    "Trailers",
    "DIY",
    "Food",
    "Cars",
    "Vlogs",
    "Documentary",
    "Animation",
    "Crypto",
    "AI",
    "Photography",
    "Health",
    "Fitness",
  ];

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/allVideo")
      .then((res) => {
        setData(res.data?.videos || []);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1600) setChunkSize(16);
      else if (width >= 1280) setChunkSize(14);
      else if (width >= 1024) setChunkSize(10);
      else if (width >= 840) setChunkSize(6);
      else if (width >= 600) setChunkSize(6);
      else setChunkSize(3);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(categories.length / chunkSize);
  const getCurrentChunk = () => {
    const start = page * chunkSize;
    return categories.slice(start, start + chunkSize);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVideoCount((prev) => prev + 12);
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, []);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date() - date) / 1000);
    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1)
        return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }

    return "Just now";
  };

  const formatViewCount = (num) => {
    if (num >= 1_000_000_000)
      return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    if (num >= 1_000_000)
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    return num?.toString();
  };

  const filteredVideos =
    selectedCategory === "All"
      ? data
      : data.filter(
          (video) =>
            video?.videoType?.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0f0f0f] text-white">
      {/* Categories Carousel */}
      <div className="flex items-center gap-2 px-4 py-5 mt-3 sticky top-0 z-40 bg-[#0f0f0f] backdrop-blur-md shadow-[inset_0px_-1px_2px_rgba(255,255,255,0.05)]">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
          className={`p-2 rounded-full ${
            page === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-[#272727]"
          }`}
        >
          <ChevronLeft />
        </button>

        <div className="relative flex-1 overflow-hidden">
          <div className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth">
            {getCurrentChunk()?.map((category, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedCategory(category);
                  setVideoCount(20); // reset scroll load
                }}
                className={`whitespace-nowrap px-4 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === category
                    ? "bg-white text-black font-medium"
                    : "bg-[#272727] text-white hover:bg-[#3d3d3d]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={page >= totalPages - 1}
          className={`p-2 rounded-full ${
            page >= totalPages - 1
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-[#272727]"
          }`}
        >
          <ChevronRight />
        </button>
      </div>

      {/* Video Grid */}
      <div className="grid gap-6 p-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 flex-grow">
        {filteredVideos?.slice(0, videoCount).map((video, idx) => (
          <Link
            key={video?._id || idx}
            to={`/watch/${video?._id}`}
            onClick={() =>
              axios.put(`http://localhost:4000/api/video/views/${video?._id}`)
            }
            className="cursor-pointer group"
          >
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#222]">
              <img
                src={
                  video?.thumbnail ||
                  `https://picsum.photos/seed/${idx}/400/225`
                }
                alt={video?.title || "Video"}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              />
            </div>
            <div className="flex pt-3 space-x-3">
              <img
                src={
                  video?.user?.profilePic ||
                  `https://i.pravatar.cc/40?img=${idx % 70}`
                }
                alt="Channel"
                className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow-sm bg-[#ccc] shrink-0"
                loading="lazy"
              />
              <div className="flex flex-col overflow-hidden">
                <h3 className="text-white font-medium text-sm leading-snug line-clamp-2">
                  {video?.title}
                </h3>

                <p className="text-xs text-gray-400 mt-0.5 hover:text-white transition-colors duration-200 cursor-pointer flex items-center gap-1">
                  {video?.user?.channelName}
                  {video?.user?.isVerified && (
                    <FaCheckCircle className="w-3 h-3 text-gray-400 hover:text-blue-500 transition-colors duration-200 " />
                  )}
                </p>

                <p className="text-xs text-gray-400 cursor-pointer">
                  {formatViewCount(video?.views)} views •{" "}
                  {formatTimeAgo(video?.createdAt)}
                </p>
              </div>
            </div>
          </Link>
        ))}

        {/* Skeleton Loader */}
        {data.length === 0 &&
          Array.from({ length: 8 }).map((_, idx) => (
            <div key={`skeleton-${idx}`} className="space-y-3 animate-pulse">
              <div className="aspect-video rounded-lg bg-[#1f1f1f]"></div>
              <div className="flex space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#1f1f1f]"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-3/4 bg-[#1f1f1f] rounded"></div>
                  <div className="h-3 w-1/2 bg-[#1f1f1f] rounded"></div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Loader Observer */}
      <div ref={loaderRef} className="h-28 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          {/* Gradient spinning ring */}
          <div className="w-12 h-12 rounded-full border-[3px] border-t-transparent animate-spin bg-gradient-to-tr from-[#ff0000] to-[#cc0000] p-1">
            <div className="w-full h-full bg-[#0f0f0f] rounded-full"></div>
          </div>

          {/* Glowing pulse text */}
          <span className="text-sm text-gray-300 animate-pulse tracking-wide font-medium">
            Loading more videos...
          </span>
        </div>
      </div>
    </div>
  );
}
