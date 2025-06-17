"use client";

import ChatCard from "@/components/ChatCard/ChatCard";
import Sidebar from "@/components/Sidebar/Sidebar";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const searchParams = useSearchParams();
  const threadId = searchParams.get("thread")


  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await axios.get("/api/chat/threads");
        if (!res.data.success) {
          console.error("Failed to fetch threads:", res.data.message);
          setThreads([])
          }
        if (res.data.success) {
          setThreads(res.data.threads);
        }
      } catch (error) {
        console.error("Failed to fetch threads:", error);
        setThreads([]);
      }
    };
    fetchThreads();
  }, []);

  return (
    <div className="relative bg-[#f2e6f5] dark:bg-[#1d131a] h-screen overflow-hidden flex">
      {/* Sidebar */}
      <div className="hidden md:block ">
        <Sidebar
          threads={threads}
          setThreads={setThreads}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300 h-screen">
        {/* ChatCard */}
        <ChatCard
          isCollapsed={isCollapsed}
          setThreads={setThreads}
          threadId={threadId || undefined}
        />
      </div>
    </div>
  );
}
