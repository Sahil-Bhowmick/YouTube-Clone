import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
export default function HomePage() {
  const categories = [
    "All",
    "Music",
    "Live",
    "Gaming",
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

  const [chunkSize, setChunkSize] = useState(10);
  const [page, setPage] = useState(0);
  const [videoCount, setVideoCount] = useState(20);
  const loaderRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width >= 1600) {
        setChunkSize(16);
      } else if (width >= 1280) {
        setChunkSize(14);
      } else if (width >= 1024) {
        setChunkSize(10);
      } else if (width >= 840) {
        setChunkSize(6);
      } else if (width >= 600) {
        setChunkSize(6);
      } else {
        setChunkSize(3);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call on mount

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
        if (entries[0].isIntersecting) {
          setVideoCount((prev) => prev + 12);
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, []);

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

        {/* Wrapper to fix shaking */}
        <div className="relative flex-1 overflow-hidden">
          <div className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth">
            {getCurrentChunk().map((category, index) => (
              <button
                key={index}
                className={`whitespace-nowrap px-4 py-1 rounded-full text-sm transition-colors ${
                  category === "All"
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
      <Link
        to={"/watch/1234"}
        className="grid gap-6 p-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 flex-grow"
      >
        {Array.from({ length: videoCount }).map((_, idx) => (
          <div key={idx} className="cursor-pointer group animate-fadeIn">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-[#222]">
              <img
                src={`https://picsum.photos/seed/${idx}/400/225`}
                alt={`Thumbnail ${idx}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              />
            </div>
            <div className="flex pt-3 space-x-3">
              <img
                src={`https://i.pravatar.cc/40?img=${idx % 70}`}
                alt="Channel Avatar"
                className="w-9 h-9 rounded-full bg-[#555] shrink-0"
                loading="lazy"
              />
              <div className="flex flex-col overflow-hidden">
                <h3 className="font-medium text-[0.9rem] text-white leading-snug line-clamp-2">
                  Lazy Loaded Video #{idx + 1} with an awesome thumbnail
                </h3>
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  Channel Name #{idx + 1}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {`${Math.floor(1 + Math.random() * 9)}M views • ${Math.floor(
                    1 + Math.random() * 11
                  )} days ago`}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Skeleton Loaders */}
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={`skeleton-${idx}`} className="space-y-3 animate-pulse">
            <div className="aspect-video rounded-lg bg-[#1f1f1f]"></div>
            <div className="flex space-x-3">
              <div className="w-9 h-9 rounded-full bg-[#1f1f1f]"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 w-3/4 bg-[#1f1f1f] rounded"></div>
                <div className="h-3 w-1/2 bg-[#1f1f1f] rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </Link>

      {/* Loader Observer */}
      <div ref={loaderRef} className="h-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
          <span className="text-sm text-gray-400 animate-pulse">
            Loading more videos...
          </span>
        </div>
      </div>
    </div>
  );
}
