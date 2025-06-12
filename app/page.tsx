"use client";

import ChatCard from "@/components/ChatCard/ChatCard";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useState } from "react";

export default function Home() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="relative bg-[#f2e6f5] h-screen overflow-hidden flex">
      <div className="">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>
      {/* Sidebar */}

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300 h-screen">
        <ChatCard isCollapsed={isCollapsed} />
      </div>
    </div>
  );
}
