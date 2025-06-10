"use client";

import { useRef, useState } from "react";
import WelcomeScreen from "./Welcome-screen";
import ChatInputBox from "./ChatInputBox";

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
    // Optionally: Send message to backend/AI here
  };

  return (
    <div className="h-screen w-full bg-[#f9f3f9] flex flex-col rounded-tl-[2rem] border border-[#efbdeb] mt-3.5">
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
