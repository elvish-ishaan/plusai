"use client";

import { useEffect, useRef, useState } from "react";
import WelcomeScreen from "./Welcome-screen";
import ChatInputBox from "./ChatInputBox";
import TopRightIconHolder from "./ToprightComps";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import ChatLoader from "../Loaders/ChatLoader";
import PromptBubble from "./PromptBubble";

interface ChatCardProps {
  isCollapsed: boolean;
  setThreads?: React.Dispatch<React.SetStateAction<Thread[]>>;
  threadId?: string;
}

export default function   ChatCard({
  isCollapsed,
  setThreads,
  threadId,
}: ChatCardProps) {
  const [chat, setchat] = useState<Chat[]>([]);
  const [message, setMessage] = useState<string>("");
  const [provider, setProvider] = useState<string>("gemini");
  const [model, setModel] = useState<string>("gemini-2.0-flash");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [isInitPrompt, setIsInitPrompt] = useState<boolean>(true);
  const [isWebSearchEnabled, setIsWebSearchEnabled] = useState<boolean>(false);
  const { data: session } = useSession();

  // Generate UUID for new threads
  const [currentThreadId, setCurrentThreadId] = useState<string>(() => uuid());
  const [fileUrl, setFileUrl] = useState<string | null>(null);



  // Load thread data when threadId changes
  useEffect(() => {
    if (!threadId) {
      setchat([]);
      setCurrentThreadId(uuid());
      setIsInitPrompt(true);
      return;
    }

    const getThread = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`/api/chat/threads/${threadId}`);
        if (res.data.success) {
          setCurrentThreadId(threadId);
          setchat(res.data.thread?.chats || []);
          setIsInitPrompt(false);
        }
      } catch (err) {
        console.error("Failed to fetch thread:", err);
        setchat([
          {
            id: uuid(),
            prompt: "Error loading conversation",
            response: "Failed to load the conversation. Please try again.",
            provider: "system",
            model: "system",
            thread: threadId,
            userId: session?.user?.id || "unknown-user",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    getThread();
  }, [threadId, session?.user?.id]);

  const handlePromptSelect = (prompt: string) => {
    setMessage(prompt);
    inputRef.current?.focus();
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    setIsLoading(true);
    // Create temporary chat entry while waiting for response
    const tempChatId = uuid();
    setchat((prev) => [
      ...prev,
      {
        id: tempChatId,
        prompt: text,
        response: "",
        provider: provider || "gemini",
        model,
        attachmentUrl: fileUrl || null,
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
        attachmentUrl: fileUrl || null,
        isWebSearchEnabled,
        maxOutputTokens: 500,
        temperature: 0.5,
        systemPrompt: "you are helpful assistant.",
        llmProvider: provider || "gemini",
      };
      console.log(body, "body in handleSend");

      const res = await axios.post(`api/chat`, body);
      if (res.data.success) {
        // Remove temp entry and add real response
        setchat((prev) => {
          const filtered = prev.filter((c) => c.id !== tempChatId);
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
          const titleRes = await axios.post(`/api/chat/generate-title`, {
            initPrompt: text,
          });

          if (titleRes.data.success) {
            setIsInitPrompt(false);
            // Use the backend thread ID if available
            const newThreadId =
              res.data.genResponse?.thread?.id || currentThreadId;
              //@ts-expect-error fix it
            setThreads?.((prev) => {
              // Only add if not already present
              if (prev.some((t) => t.id === newThreadId)) return prev;
              return [
                ...prev,
                {
                  id: newThreadId,
                  title: titleRes.data.title,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  userId: session?.user?.id || "",
                },
              ];
            });
          }
        } catch (err) {
          console.error("Failed to generate title:", err);
        }
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      // Remove temp entry on error
      setchat((prev) => prev.filter((c) => c.id !== tempChatId));
      // Add error message
      setchat((prev) => [
        ...prev,
        {
          id: uuid(),
          prompt: "Error",
          response: "Failed to send message. Please try again.",
          provider: "system",
          model: "system",
          thread: currentThreadId,
          userId: session?.user?.id || "unknown-user",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    console.log(isWebSearchEnabled, 'isWebSearchEnabled');
  }, [isWebSearchEnabled]);

  return (
    <div
      className={`relative flex flex-col ${
        isCollapsed
          ? "w-screen h-screen bg-[#f9f3f9] dark:bg-[#211c26]"
          : "h-screen w-full md:mt-3.5 md:rounded-l-xl md:border dark:bg-[#221d27] border-[#efbdeb] dark:border-[#322028]  bg-[#f9f3f9] shadow-md"
      } overflow-hidden`}
    >
      <TopRightIconHolder isCollapsed={isCollapsed} />

      <div className="flex-1 relative px-8 py-6 space-y-3 overflow-y-scroll scrollbar-hide">
        {chat.length === 0 && !message && !isLoading ? (
          <WelcomeScreen onPromptSelect={handlePromptSelect} />
        ) : (
          <div className="max-w-4xl mx-auto h-full overflow-y-auto scrollbar-hide pb-52 pr-2">
            {/* ↑ pb-52 ensures space for fixed ChatInputCard */}
            {chat?.map((chatItem) => (
              <div
                key={chatItem.id}
                className="flex flex-col space-y-4 mb-3 mt-8"
              >
                <div className="flex justify-end">
                  <PromptBubble prompt={chatItem?.prompt} />
                </div>
                {chatItem.response && (
                  <div className="flex justify-start">
                    <div className="p-3 max-w-xs md:max-w-md lg:max-w-2xl prose prose-sm">
                      <ReactMarkdown>{chatItem.response}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="p-3 animate-pulse">
                  <ChatLoader />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* <ChatMessageArea messages={chat} message={message} onPromptSelect={handlePromptSelect} loading={isLoading} /> */}

      <div className="relative z-10 backdrop-blur-lg">
        <div className="max-w-4xl w-full mx-auto bg-[rgba(249,243,249,0.8)] dark:bg-[#221d27]/80 sticky bottom-0 backdrop-blur-md  border-[#efbdeb] dark:border-[#322028]">
          <ChatInputBox
            message={message}
            setFileUrl={setFileUrl}
            currentThreadId={currentThreadId}
            setMessage={setMessage}
            
            setProvider={setProvider}
            setIsWebSearchEnabled={setIsWebSearchEnabled}
            onSend={handleSend}
            setModel={setModel}
            model={model}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
