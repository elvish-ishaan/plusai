"use client";

import ChatCard from "@/components/ChatCard/ChatCard";
import Sidebar from "@/components/Sidebar/Sidebar";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await axios.get("/api/chat/threads");
        if (res.data.success) {
          setThreads(res.data.threads);
        }
      } catch (error) {
        console.error('Error fetching threads:', error);
      }
    };
    fetchThreads();
  }, []);
  
  //console threds whenever thread array changes
  useEffect(() => {
    console.log(threads, 'threads');
  }, [threads]);

  return (
    <div className="relative bg-[#f2e6f5] h-screen overflow-hidden flex">
      {/* Sidebar */}
      <Sidebar 
        threads={threads} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
        setThreads={setThreads}
        onThreadSelect={setSelectedThreadId}
        selectedThreadId={selectedThreadId}
      />

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300 h-screen">
        <ChatCard 
          isCollapsed={isCollapsed} 
          setthreads={setThreads}
          selectedThreadId={selectedThreadId}
        />
      </div>
    </div>
  );
}
