import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "../App.css";
import HomePage from "./HomePage";

export default function YouTubeLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("home");

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
        <main className="flex-1 overflow-y-auto bg-[#0f0f0f]">
          <HomePage />
        </main>
      </div>
    </div>
  );
}
