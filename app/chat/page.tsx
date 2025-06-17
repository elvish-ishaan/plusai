"use client";

import ChatCard from "@/components/ChatCard/ChatCard";
import {  useState } from "react";

export default function Page() {
  const [isCollapsed] = useState(false);
 
  return (    
      <div className="flex-1 transition-all duration-300 h-screen">
        <ChatCard isCollapsed={isCollapsed} />
    </div>
  );
}
