"use client";

import { useRef, useState } from "react";
import WelcomeScreen from "./Welcome-screen";
import ChatInputBox from "./ChatInputBox";
import TopRightIconHolder from "./ToprightComps";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { useSession } from "next-auth/react";
import ChatMessageArea from "./ChatMessageArea";

export type Message = { sender: string; text: string };

interface ChatCardProps {
  isCollapsed: boolean;
  setthreads: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function ChatCard({ isCollapsed, setthreads }: ChatCardProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [provider, setProvider] = useState<string>("");
  const [model, setModel] = useState<string>("gemini-2.0-flash");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isInitPrompt, setIsInitPrompt] = useState<boolean>(true);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  console.log(session, "session");
  //gen id on first render
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(() =>
    uuid()
  );

  const handlePromptSelect = (prompt: string) => {
    setMessage(prompt);
    inputRef.current?.focus();
  };


  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setMessage("");
    setLoading(true); // Start loading

    try {
      const res = await axios.post(`${baseUrl}/chat`, {
        prompt: text, // ← should be text, not message
        prevPrompts: messages,
        provider,
        model,
        threadId: currentThreadId,
        maxOutputTokens: 500,
        temperature: 0.5,
        systemPrompt: "you are helpful assistant.",
        llmProvider: "gemini",
      });

      if (res.data.success) {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: res.data.genResponse },
        ]);
      }

      // Title generation
      if (isInitPrompt) {
        const res = await axios.post(`${baseUrl}/chat/generate-title`, {
          initPrompt: text,
        });
        if (res.data.success) {
          setIsInitPrompt(false);
          setthreads((prev) => [
            ...prev,
            {
              id: currentThreadId,
              title: res.data.title,
              date: new Date().toLocaleDateString(),
            },
          ]);
        }
      }
    } catch (err) {
      console.error("AI response error", err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div
      className={`relative flex flex-col  ${
        isCollapsed
          ? "w-screen h-screen  bg-[#f9f3f9] "
          : "h-screen w-full md:mt-3.5 md:rounded-xl md:border border-[#efbdeb] bg-[#f9f3f9] shadow-md"
      } overflow-hidden`}
    >
      {/* Top-Right Icons */}

      <TopRightIconHolder isCollapsed={isCollapsed} />

      {/* Chat Messages Area */}
      <ChatMessageArea
        messages={messages}
        message={message}
        onPromptSelect={handlePromptSelect}
        loading={loading}
      />

      {/* Input Box */}
      <div className="px-6  border-[#efbdeb] bg-[#f9f3f9]">
        <ChatInputBox
          message={message}
          setMessage={setMessage}
          onSend={handleSend}
          setmodel={setModel}
          // @ts-ignore
          inputRef={inputRef}
        />
      </div>
    </div>
  );
}
