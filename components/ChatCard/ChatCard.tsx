"use client";

import { useEffect, useRef, useState } from "react";
import WelcomeScreen from "./Welcome-screen";
import ChatInputBox from "./ChatInputBox";
import TopRightIconHolder from "./ToprightComps";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";

interface Thread {
  id: string;
  title: string;
  date: string;
}

interface ChatCardProps {
  isCollapsed: boolean;
  setthreads?: React.Dispatch<React.SetStateAction<Thread[]>>;
  threadId?: string;
}

export default function ChatCard({
  isCollapsed,
  setthreads,
  threadId,
}: ChatCardProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [chat, setchat] = useState<Chat[]>([]);
  const [message, setMessage] = useState<string>("");
  const [provider, setProvider] = useState<string>("");
  const [model, setModel] = useState<string>("gemini-2.0-flash");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isInitPrompt, setIsInitPrompt] = useState<boolean>(true);
  const { data: session } = useSession();

  const [currentThreadId, setCurrentThreadId] = useState<string>(() => uuid());

  useEffect(() => {
    if (!threadId) return;

    const getThread = async () => {
      try {
        const res = await axios.get(`${baseUrl}/chat/threads/${threadId}`);
        console.log(res.data, "getting thread response");

        if (res.data.success) {
          setCurrentThreadId(threadId);
          setchat(res.data.thread?.chats || []);
        }
      } catch (err) {
        console.error("Failed to fetch thread:", err);
      }
    };

    getThread();
  }, [threadId]);

  const handlePromptSelect = (prompt: string) => {
    setMessage(prompt);
    inputRef.current?.focus();
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    setchat((prev) => [...prev, { id: uuid(), prompt: message, response: null }]);
    setMessage("");

    const res = await axios.post(`${baseUrl}/chat`, {
      prompt: message,
      prevPrompts: chat,
      provider,
      model,
      threadId: currentThreadId,
      maxOutputTokens: 500,
      temperature: 0.5,
      systemPrompt: "you are helpful assistant.",
      llmProvider: "gemini",
    });

    if (res.data.success) {
      setchat((prev) => [
        ...prev,
        { id: res.data.genResponse?.id, prompt: message, response: res.data.genResponse },
      ]);
    }

    if (isInitPrompt) {
      try {
        const titleRes = await axios.post(`${baseUrl}/chat/generate-title`, {
          initPrompt: text,
        });

        if (titleRes.data.success) {
          setIsInitPrompt(false);
          setthreads?.((prev) => [
            ...prev,
            {
              id: currentThreadId,
              title: titleRes.data.title,
              date: new Date().toLocaleDateString(),
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to generate title:", err);
      }
    }
  };

  return (
    <div
      className={`relative flex flex-col ${
        isCollapsed
          ? "w-screen h-screen bg-[#f9f3f9]"
          : "h-screen w-full mt-3.5 rounded-xl border border-[#efbdeb] bg-[#f9f3f9] shadow-md"
      } overflow-hidden`}
    >
      <TopRightIconHolder isCollapsed={isCollapsed} />

      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-3 scrollbar-hide w-1/2 items-center justify-center">
        {chat.length === 0 && !message ? (
          <WelcomeScreen onPromptSelect={handlePromptSelect} />
        ) : (
          chat.map((chat) => (
            <div key={chat.id} className=" flex flex-col space-y-1 ">
              <span className=" p-3 bg-[#7a375b] rounded-md self-end">{chat?.prompt}</span>
              <ReactMarkdown>{chat?.response}</ReactMarkdown>
            </div>
          ))
        )}
      </div>

      <div className="px-6 border-[#efbdeb] bg-[#f9f3f9]">
        <ChatInputBox
          message={message}
          setMessage={setMessage}
          onSend={handleSend}
          setmodel={setModel}
          //@ts-expect-error ref typing
          inputRef={inputRef}
        />
      </div>
    </div>
  );
}
