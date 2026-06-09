"use client";

import { useEffect, useRef, useState } from "react";
import WelcomeScreen from "./Welcome-screen";
import ChatInputBox from "./ChatInputBox";
import TopRightIconHolder from "./ToprightComps";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { useSession } from "next-auth/react";
import ChatLoader from "../Loaders/ChatLoader";
import PromptBubble from "./PromptBubble";
import { toast } from "sonner";
import { MarkdownRenderer } from "./TypingAnimation";

// NDJSON message types from the streaming API
type StreamChunk = { t: "c"; v: string };
type StreamDone = { t: "d"; id: string; threadId: string; model: string; provider: string; prompt: string; response: string; createdAt: string; updatedAt: string };
type StreamError = { t: "e"; message: string };
type StreamMessage = StreamChunk | StreamDone | StreamError;

interface ChatCardProps {
  isCollapsed: boolean;
  setThreads?: React.Dispatch<React.SetStateAction<Thread[]>>;
  threadId?: string;
}

export default function ChatCard({ isCollapsed, setThreads, threadId }: ChatCardProps) {
  const [chat, setchat] = useState<Chat[]>([]);
  const [message, setMessage] = useState<string>("");
  const [provider, setProvider] = useState<string>("google");
  const [model, setModel] = useState<string>("google/gemini-2.5-flash");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingChatId, setStreamingChatId] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [isInitPrompt, setIsInitPrompt] = useState<boolean>(true);
  const [isWebSearchEnabled, setIsWebSearchEnabled] = useState<boolean>(false);
  const { data: session } = useSession();
  const [currentThreadId, setCurrentThreadId] = useState<string>(() => uuid());
  const [fileUrl, setFileUrl] = useState<string | null>(null);

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
        setchat([{
          id: uuid(),
          prompt: "Error loading conversation",
          response: "Failed to load the conversation. Please try again.",
          provider: "system",
          model: "system",
          thread: threadId,
          userId: session?.user?.id || "unknown-user",
          createdAt: new Date(),
          updatedAt: new Date(),
        }]);
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

    const tempId = uuid();
    setStreamingChatId(tempId);
    setIsLoading(true);

    setchat((prev) => [
      ...prev,
      {
        id: tempId,
        prompt: text,
        response: "",
        provider: provider || "google",
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
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: text,
          prevPrompts: chat,
          model,
          threadId: currentThreadId,
          attachmentUrl: fileUrl || null,
          isWebSearchEnabled,
          maxOutputTokens: 2000,
          temperature: 0.5,
          systemPrompt: "",
          llmProvider: provider || "google",
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let finalData: StreamDone | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const msg = JSON.parse(line) as StreamMessage;

            if (msg.t === "c") {
              setchat((prev) =>
                prev.map((c) =>
                  c.id === tempId ? { ...c, response: c.response + msg.v } : c
                )
              );
            } else if (msg.t === "d") {
              finalData = msg;
              // Replace temp entry with DB-confirmed entry
              setchat((prev) =>
                prev.map((c) =>
                  c.id === tempId
                    ? {
                        ...c,
                        id: msg.id,
                        model: msg.model,
                        provider: msg.provider,
                        createdAt: new Date(msg.createdAt),
                        updatedAt: new Date(msg.updatedAt),
                      }
                    : c
                )
              );
              setCurrentThreadId(msg.threadId);
            } else if (msg.t === "e") {
              throw new Error(msg.message);
            }
          } catch {
            // skip malformed lines
          }
        }
      }

      // Generate thread title on first message
      if (isInitPrompt && finalData) {
        try {
          const titleRes = await fetch("/api/chat/generate-title", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ initPrompt: text }),
          });
          const title = (await titleRes.text()).trim();

          if (title) {
            setIsInitPrompt(false);
            const newThreadId = finalData.threadId || currentThreadId;
            //@ts-expect-error Thread type mismatch
            setThreads?.((prev) => {
              const exists = prev.some((t) => t.id === newThreadId);
              if (exists) {
                return prev.map((t) => t.id === newThreadId ? { ...t, title } : t);
              }
              return [
                {
                  id: newThreadId,
                  title,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  userId: session?.user?.id || "",
                },
                ...prev,
              ];
            });

            // Persist the LLM-generated title to DB
            if (session?.user) {
              fetch(`/api/chat/threads/${newThreadId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title }),
              }).catch(() => {});
            }
          }
        } catch (err) {
          console.error("Failed to generate title:", err);
        }
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setchat((prev) => prev.filter((c) => c.id !== tempId));
      toast.error("Failed to send message. Please try again.");
    } finally {
      setStreamingChatId(null);
      setIsLoading(false);
    }
  };

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chat, isLoading]);

  return (
    <div
      className={`relative flex flex-col ${
        isCollapsed
          ? "w-screen h-screen bg-background dark:bg-background"
          : "h-screen w-full md:mt-3.5 md:rounded-l-xl md:border dark:bg-background border-border dark:border-border bg-background shadow-md"
      } overflow-hidden`}
    >
      <TopRightIconHolder isCollapsed={isCollapsed} />

      <div className="flex-1 relative px-8 py-6 space-y-3 overflow-hidden">
        {chat.length === 0 && !message && !isLoading ? (
          <WelcomeScreen onPromptSelect={handlePromptSelect} />
        ) : (
          <div className="relative h-full">
            <div
              ref={chatContainerRef}
              className="max-w-4xl mx-auto h-full overflow-y-auto scrollbar-hide pb-42 pr-2"
            >
              {chat?.map((chatItem) => (
                <div key={chatItem.id} className="flex flex-col space-y-4 mb-3 mt-8 px-2">
                  <div className="flex justify-end">
                    <PromptBubble prompt={chatItem?.prompt} />
                  </div>

                  <div className="flex justify-start">
                    {/* Show loader until first chunk arrives */}
                    {chatItem.id === streamingChatId && chatItem.response === "" ? (
                      <div className="p-3 animate-pulse">
                        <ChatLoader />
                      </div>
                    ) : chatItem.response ? (
                      <div className="relative">
                        <MarkdownRenderer content={chatItem.response} />
                        {/* Blinking cursor while this message is streaming */}
                        {chatItem.id === streamingChatId && (
                          <span className="inline-block w-0.5 h-4 bg-foreground/70 rounded-full animate-pulse ml-0.5 align-middle" />
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10">
        <div className="max-w-4xl w-full mx-auto sticky bottom-0 backdrop-blur-md">
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
