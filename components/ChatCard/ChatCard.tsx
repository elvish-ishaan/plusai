import { useRef, useState } from "react";
import WelcomeScreen from "./Welcome-screen";
import ChatInputBox from "./ChatInputBox";
import TopRightIconHolder from "./ToprightComps";

export type Message = { sender: string; text: string };

interface ChatCardProps {
  isCollapsed: boolean;
}

export default function ChatCard({ isCollapsed }: ChatCardProps) {
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
    <div
      className={`relative flex flex-col ${
        isCollapsed
          ? "w-screen h-screen bg-[#f9f3f9]"
          : "h-screen w-full mt-3.5 rounded-xl border border-[#efbdeb] bg-[#f9f3f9] shadow-md"
      } overflow-hidden`}
    >
      {/* Top-Right Icons */}
      
      <TopRightIconHolder  isCollapsed={isCollapsed}/>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-3 scrollbar-hide">
        {messages.length === 0 && !message ? (
          <WelcomeScreen onPromptSelect={handlePromptSelect} />
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="text-[#7a375b]">
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))
        )}
      </div>

      {/* Input Box */}
      <div className="px-6  border-[#efbdeb] bg-[#f9f3f9]">
        <ChatInputBox
          message={message}
          setMessage={setMessage}
          onSend={handleSend}
          // @ts-ignore
          inputRef={inputRef}
        />
      </div>
    </div>
  );
}
