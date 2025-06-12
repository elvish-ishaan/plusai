"use client";

import ChatCard from "@/components/ChatCard/ChatCard";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Thread } from "@/types/auxtypes";
import { useEffect, useState } from "react";

export default function Home() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);

  // useEffect(() => {
  //   const fetchThreads = async () => {
  //     const res = await axios.get("/api/chat/threads");
  //     setThreads(res.data?.threads);
  //   };
  //   fetchThreads();
  // }, []);

  //console threds whenever thread array changes
  useEffect(() => {
    console.log(threads, "threads");
  }, [threads]);

  return (
    <div className="relative bg-[#f2e6f5] h-screen overflow-hidden flex">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          threads={threads}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300 h-screen md:mt-">
        <ChatCard isCollapsed={isCollapsed} setthreads={setThreads} />
      </div>
    </div>
  );
}
