"use client";

import ChatCard from "@/components/ChatCard/ChatCard";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const threadId = params?.threadId as string | undefined;
  
  //{Error} :lints threads and setIsCollapsed are declared but its value is never read.ts(6133)
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  console.log(threads);
  return (
    <div className="flex-1 transition-all duration-300 h-screen">
      <ChatCard
        threadId={threadId}
        isCollapsed={isCollapsed}
        setthreads={setThreads}
      />
    </div>
  );
}
