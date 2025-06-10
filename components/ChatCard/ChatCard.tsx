"use client";

import { useRef, useState } from "react";
import { Settings2, Moon } from "lucide-react";
import WelcomeScreen from "./Welcome-screen";
import ChatInputBox from "./ChatInputBox";
import TopRightIconHolder from "./ToprightComps";

export type Message = { sender: string; text: string };

export default function ChatCard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handlePromptSelect = (prompt: string) => {
    setMessage(prompt);
    inputRef.current?.focus();
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setMessage("");
  };

  return (
    <div className="relative h-screen w-full bg-[#f9f3f9] flex flex-col border border-[#efbdeb] mt-3.5 rounded-xl overflow-hidden">
      {/* Top-Right Icons with Downward Curve */}
      <TopRightIconHolder />

      {/* Message Area */}
      <div className="flex-1 overflow-auto px-10 py-8">
        {messages.length === 0 && !message ? (
          <WelcomeScreen onPromptSelect={handlePromptSelect} />
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="mb-2 text-[#7a375b]">
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="px-6  border-[#efbdeb]">
        <ChatInputBox
          message={message}
          setMessage={setMessage}
          onSend={handleSend}
          //@ts-ignore
          inputRef={inputRef}
        />
      </div>
    </div>
  );
}
