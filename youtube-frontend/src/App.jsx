// App.jsx
import React, { useState, useEffect, Suspense, lazy, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";
import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// Optional customization of loader
NProgress.configure({ showSpinner: false, trickleSpeed: 500 });

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const VideoPage = lazy(() => import("./pages/VideoPage"));
const Profile = lazy(() => import("./pages/Profile"));
const VideoUpload = lazy(() => import("./pages/VideoUpload"));
const AuthPage = lazy(() => import("./pages/AuthPage"));

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("home");

  const location = useLocation();
  const contentRef = useRef(null);

  // Handle loader on route change
  useEffect(() => {
    NProgress.start();
    const timeout = setTimeout(() => {
      NProgress.done();
    }, 400); // Slight delay to simulate loading

    return () => clearTimeout(timeout);
  }, [location.pathname]);

  // Auto close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll to top on page change
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-white relative">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />

      <div className="flex-1 flex flex-col">
        <Navbar
          className="sticky top-0 z-50"
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <ErrorBoundary>
          <Suspense
            fallback={<div className="text-center mt-10">Loading...</div>}
          >
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
