"use client";

import { useState } from "react";
import WelcomeScreen from "./Welcome-screen";
import ChatInputBox from "./ChatInputBox";

export type Message = { sender: string; text: string };

export default function ChatCard() {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = async (message: string) => {
    // Handle sending message here
  };

  return (
    <div className="h-screen w-full bg-[#f9f3f9] flex flex-col rounded-tl-[2rem] border border-[#efbdeb] mt-3.5">
      {/* Scrollable chat/message area */}
      <div className="flex-1 overflow-auto px-10 py-8">
        <WelcomeScreen onPromptSelect={handleSend} />
        {/* Future: Render messages here */}
      </div>

      {/* Input always at the bottom */}
      <div className="px-6   border-[#efbdeb]">
        <ChatInputBox />
      </div>
    </div>
  );
}
