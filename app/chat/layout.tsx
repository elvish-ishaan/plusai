"use client";

import Sidebar from "@/components/Sidebar/Sidebar";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Layout({children}: {children: React.ReactNode}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isThreadsLoading, setIsThreadsLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchThreads = async () => {
      setIsThreadsLoading(true)
      const res = await axios.get("/api/chat/threads");
      setIsThreadsLoading(false)
      setThreads(res.data?.threads);
    };
    fetchThreads();
  }, [])
  
  return (
    <div className="relative bg-background dark:bg-background h-screen overflow-hidden flex">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          isThreadsLoading={isThreadsLoading}
          threads={threads}
          setThreads={setThreads}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 h-screen ${
          !isCollapsed ? "md:mt-3.5" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}
