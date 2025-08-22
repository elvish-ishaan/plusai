import React from "react";
import WelcomeScreen from "./Welcome-screen";
import ChatLoader from "../Loaders/ChatLoader";

export default function ChatMessageArea({
  messages,
  message,
  onPromptSelect,
  loading,
}: MessageProps) {
  const hasMessages = messages.length > 0 || message;

  return (
    <div className="flex-1 flex flex-col mt-10 px-4 py-6">
      {!hasMessages ? (
        <div className="max-w-[800px] mx-auto">
          <WelcomeScreen onPromptSelect={onPromptSelect} />
        </div>
      ) : (
        <div className="max-w-[800px] mx-auto flex-1 overflow-y-auto pr-2 custom-scroll space-y-3">
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
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted text-muted-foreground rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted text-muted-foreground px-4 py-2 rounded-lg max-w-[70%] text-sm">
                <ChatLoader />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
