"use client"

import { useRef, useState, useEffect } from "react";
import WelcomeScreen from "./Welcome-screen";
import ChatInputBox from "./ChatInputBox";
import TopRightIconHolder from "./ToprightComps";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { useSession } from "next-auth/react";

export type Message = { sender: string; text: string };

interface ChatCardProps {
  isCollapsed: boolean;
  setthreads: React.Dispatch<React.SetStateAction<any[]>>;
  selectedThreadId: string | null;
}

export default function ChatCard({ isCollapsed, setthreads, selectedThreadId }: ChatCardProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [provider, setProvider] = useState<string>('');
  const [model, setModel] = useState<string>('gemini-2.0-flash');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isInitPrompt, setIsInitPrompt] = useState<boolean>(true);
  const { data: session } = useSession();
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(() => uuid());

  // Load messages when thread is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedThreadId) {
        setMessages([]);
        setCurrentThreadId(uuid());
        setIsInitPrompt(true);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(`${baseUrl}/api/chat/threads/${selectedThreadId}/messages`);
        if (response.data.success) {
          const formattedMessages = response.data.messages.map((msg: any) => ({
            sender: msg.sender,
            text: msg.text
          }));
          setMessages(formattedMessages);
          setCurrentThreadId(selectedThreadId);
          setIsInitPrompt(false);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [selectedThreadId, baseUrl]);

  const handlePromptSelect = (prompt: string) => {
    setMessage(prompt);
    inputRef.current?.focus();
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setMessage("");
    
    try {
      const res = await axios.post(`${baseUrl}/chat`, {
        prompt: text,
        prevPrompts: messages,
        provider: provider,
        model: model,
        threadId: currentThreadId,
        maxOutputTokens: 500,
        temperature: 0.5,
        systemPrompt: 'you are helpful assistant.',
        llmProvider: 'gemini'
      });

      if (res.data.success) {
        setMessages((prev) => [...prev, { sender: "ai", text: res.data.genResponse }]);
      }
      
      if (isInitPrompt) {
        const titleRes = await axios.post(`${baseUrl}/chat/generate-title`, {
          initPrompt: text,
        });
        
        if (titleRes.data.success) {
          setIsInitPrompt(false);
          setthreads((prev) => [...prev, {
            id: currentThreadId,
            title: titleRes.data.title,
            date: new Date().toLocaleDateString()
          }]);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [...prev, { 
        sender: "ai", 
        text: "Sorry, there was an error processing your message. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
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
      {/* Top-Right Icons */}
      
      <TopRightIconHolder  isCollapsed={isCollapsed}/>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-3 scrollbar-hide">
        {messages.length === 0 && !message && !isLoading ? (
          <WelcomeScreen onPromptSelect={handlePromptSelect} />
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="text-[#7a375b]">
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))
        )}
        {isLoading && (
          <div className="text-[#7a375b] animate-pulse">
            <strong>AI:</strong> Thinking...
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="px-6  border-[#efbdeb] bg-[#f9f3f9]">
        <ChatInputBox
          message={message}
          setMessage={setMessage}
          onSend={handleSend}
          setmodel={setModel}
          inputRef={inputRef}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
