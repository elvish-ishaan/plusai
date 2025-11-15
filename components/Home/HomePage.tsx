"use client";

import ChatCard from "@/components/ChatCard/ChatCard";
import Sidebar from "@/components/Sidebar/Sidebar";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isThreadsLoading, setIsThreadsLoading] = useState<boolean>(false)
  const searchParams = useSearchParams();
  const threadId = searchParams.get("thread");
  const {data: session} = useSession();

  useEffect(() => {
    const fetchThreads = async () => {
      if(!session?.user){
        return
      }
      try {
        setIsThreadsLoading(true)
        const res = await axios.get("/api/chat/threads");
        if (!res.data.success) {
          console.error("Failed to fetch threads:", res.data.message);
          setThreads([]);
        } else {
          setThreads(res.data.threads);
        }
      } catch (error) {
        console.error("Failed to fetch threads:", error);
        setThreads([]);
      }finally{
        setIsThreadsLoading(false)
      }
    };
    fetchThreads();
  }, []);

  return (
    <>
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
      <div className="flex-1 transition-all duration-300 h-screen">
        <ChatCard
          isCollapsed={isCollapsed}
          setThreads={setThreads}
          threadId={threadId || undefined}
        />
      </div>
    </div>
    </>
  );
}
