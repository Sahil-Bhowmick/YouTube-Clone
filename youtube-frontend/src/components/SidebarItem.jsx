import React from "react";

export default function SidebarItem({
  icon,
  label,
  sidebarOpen,
  active,
  onClick,
}) {
  return (
    <div
      className={`flex items-center cursor-pointer p-2 rounded hover:bg-[#222] ${
        active ? "bg-[#222]" : ""
      }`}
      onClick={onClick}
    >
      <div className="text-white mr-3">{icon}</div>
      {sidebarOpen && <span className="text-sm text-white">{label}</span>}
    </div>
  );
}
