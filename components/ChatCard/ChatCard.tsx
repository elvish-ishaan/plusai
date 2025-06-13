"use client";

import { useEffect, useRef, useState } from "react";
import WelcomeScreen from "./Welcome-screen";
import ChatInputBox from "./ChatInputBox";
import TopRightIconHolder from "./ToprightComps";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";


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

  // Generate UUID for new threads, but keep as string since API expects string UUID
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
    
    // Create temporary chat entry while waiting for response
    const tempChatId = uuid();
    setchat((prev) => [
  ...prev,
  {
    id: tempChatId,
    prompt: text,
    response: "",
    provider: "gemini",
    model,
    thread: currentThreadId,  
    userId: session?.user?.id || "unknown-user",
    createdAt: new Date(),   
    updatedAt: new Date(),
  },
]);

    
    setMessage("");

    try {
      const body = {
        prompt: text,
        prevPrompts: chat,
        model,
        threadId: currentThreadId,
        maxOutputTokens: 500,
        temperature: 0.5,
        systemPrompt: "you are helpful assistant.",
        llmProvider: "gemini",
      };
      
      console.log(body, 'body sending.........');
      const res = await axios.post(`${baseUrl}/chat`, body);
      console.log(res.data,'getting data from backend')

      if (res.data.success) {
        // Remove temp entry and add real response
        setchat((prev) => {
          const filtered = prev.filter(c => c.id !== tempChatId);
          return [...filtered, res.data.genResponse];
        });
        
        // Set thread ID if this is a new thread and we get one back from API
        if (res.data.genResponse?.thread?.id) {
          setCurrentThreadId(res.data.genResponse.thread.id);
        }
      }

      // Handle title generation for first prompt
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
                id: res.data.genResponse?.thread?.id || currentThreadId,
                title: titleRes.data.title,
                createdAt: new Date(),
                updatedAt: new Date(),
                userId: session?.user?.id || "",
              },
            ]);
          }
        } catch (err) {
          console.error("Failed to generate title:", err);
        }
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      // Remove temp entry on error
      setchat((prev) => prev.filter(c => c.id !== tempChatId));
    }
  };

  useEffect(() => { console.log(chat,'getting new chats.........')}, [chat]);

  return (
    <div
      className={`relative flex flex-col  ${
        isCollapsed
          ? "w-screen h-screen  bg-[#f9f3f9] "
          : "h-screen w-full md:mt-3.5 md:rounded-xl md:border border-[#efbdeb] bg-[#f9f3f9] shadow-md"
      } overflow-hidden`}
    >
      <TopRightIconHolder isCollapsed={isCollapsed} />

      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-3 scrollbar-hide">
        {chat.length === 0 && !message ? (
          <WelcomeScreen onPromptSelect={handlePromptSelect} />
        ) : (
          <div className="max-w-4xl mx-auto">
            {chat?.map((chatItem) => (
              <div key={chatItem.id} className="flex flex-col space-y-4 mb-6">
                <div className="flex justify-end">
                  <span className="p-3 bg-[#7a375b] text-white rounded-lg max-w-xs md:max-w-md lg:max-w-lg">
                    {chatItem.prompt}
                  </span>
                </div>
                {chatItem.response && (
                  <div className="flex justify-start">
                    <div className="p-3 bg-white rounded-lg shadow-sm max-w-xs md:max-w-md lg:max-w-2xl prose prose-sm">
                      <ReactMarkdown>{chatItem.response}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
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