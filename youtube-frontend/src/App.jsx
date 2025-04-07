import React, { useState, useEffect, Suspense, lazy, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";
import axios from "axios";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const VideoPage = lazy(() => import("./pages/VideoPage"));
const Profile = lazy(() => import("./pages/Profile"));
const VideoUpload = lazy(() => import("./pages/VideoUpload"));
const AuthPage = lazy(() => import("./pages/AuthPage"));

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("home");

  const location = useLocation(); // Get current route
  const contentRef = useRef(null); // Ref for the scrollable content div

  // Close mobile menu on window resize (UX Improvement)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset scroll position on route change
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0; // Reset scroll position for the scrollable div
    }
  }, [location.pathname]); // Runs whenever the route changes

  // Backend Intregation Testing
  // useEffect(() => {
  //   axios
  //     .get("http://localhost:4000/api/allVideo")
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-white relative">
      {/* Sidebar Component */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />

      {/* Main Content Section */}
      <div className="flex-1 flex flex-col">
        {/* Navbar Component */}
        <Navbar
          className="sticky top-0 z-50"
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Error Boundary to catch unexpected errors */}
        <ErrorBoundary>
          {/* Suspense for Lazy Loaded Components */}
          <Suspense
            fallback={<div className="text-center mt-10">Loading...</div>}
          >
            {/* Apply ref to the scrollable container */}
            <div
              ref={contentRef}
              className="flex-1 overflow-y-auto bg-[#0f0f0f]"
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/watch/:id" element={<VideoPage />} />
                <Route path="/user/:id" element={<Profile />} />
                <Route path="/:id/upload" element={<VideoUpload />} />
                <Route path="/auth" element={<AuthPage />} />
              </Routes>
            </div>
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
