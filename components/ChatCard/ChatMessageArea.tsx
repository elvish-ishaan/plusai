import React from "react";
import WelcomeScreen from "./Welcome-screen";
import { MessageProps } from "@/types/auxtypes";
import ChatLoader from "../Loaders/ChatLoader";


export default function ChatMessageArea({
  messages,
  message,
  onPromptSelect,
  loading,
}: MessageProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide mt-10">
      {messages.length === 0 && !message ? (
        <div className="max-w-[800px] mx-auto">
          <WelcomeScreen onPromptSelect={onPromptSelect} />
        </div>
      ) : (
        <div className="space-y-3 max-w-[800px] mx-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[70%] text-sm ${
                  msg.sender === "user"
                    ? "bg-[#f0c7e0] text-[#501854] rounded-br-none"
                    : "bg-[#f6ebf4] text-[#7a375b] rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#f6ebf4] text-[#7a375b] px-4 py-2 rounded-lg max-w-[70%] text-sm">
                <ChatLoader />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
