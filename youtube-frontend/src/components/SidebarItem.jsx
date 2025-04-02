import React from "react";
import { Link } from "react-router-dom";

export default function SidebarItem({
  icon,
  label,
  sidebarOpen,
  active,
  onClick,
  route,
}) {
  return (
    <Link
      to={route}
      onClick={onClick}
      className={`flex items-center cursor-pointer p-2 rounded hover:bg-[#222] ${
        active ? "bg-[#222]" : ""
      }`}
    >
      <div className="text-white mr-3">{icon}</div>
      {sidebarOpen && <span className="text-sm text-white">{label}</span>}
    </Link>
  );
}
