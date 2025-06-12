"use client";

import ChatCard from "@/components/ChatCard/ChatCard";
import Sidebar from "@/components/Sidebar/Sidebar";
<<<<<<< HEAD
import { Thread } from "@/types/auxtypes";

=======
import axios from "axios";
>>>>>>> 4d77aeba9b599dc50e9b2a84381492da099b9a56
import { useEffect, useState } from "react";

export default function Home() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);

<<<<<<< HEAD
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
=======
  useEffect(() => {
    const fetchThreads = async () => {
      const res = await axios.get("/api/chat/threads");
      setThreads(res.data?.threads);
    };
    fetchThreads();
  }, [])
  
  //console threds whenever thread array changes
  useEffect(() => {
    console.log(threads, 'threads');
>>>>>>> 4d77aeba9b599dc50e9b2a84381492da099b9a56
  }, [threads]);

  return (
    <div className="relative bg-[#f2e6f5] h-screen overflow-hidden flex">
      {/* Sidebar */}
<<<<<<< HEAD
      <div className="hidden md:block">
        <Sidebar
          threads={threads}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300 h-screen ">
=======
      <Sidebar threads={threads} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300 h-screen">
>>>>>>> 4d77aeba9b599dc50e9b2a84381492da099b9a56
        <ChatCard isCollapsed={isCollapsed} setthreads={setThreads} />
      </div>
    </div>
  );
}
