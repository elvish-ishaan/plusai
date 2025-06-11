"use client"

import { useRef, useState } from "react";
import WelcomeScreen from "./Welcome-screen";
import ChatInputBox from "./ChatInputBox";
import TopRightIconHolder from "./ToprightComps";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { useSession } from "next-auth/react";

export type Message = { sender: string; text: string };

interface ChatCardProps {
  isCollapsed: boolean;
}

export default function ChatCard({ isCollapsed }: ChatCardProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [provider, setProvider] = useState<string>('')
  const [model, setModel] = useState<string>('')
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { data: session } = useSession();
  console.log(session,'session')
  //gen id on first render
  const [currentThreadId, setCurrentThreadId] = useState<string | null>( () => uuid() )

  const handlePromptSelect = (prompt: string) => {
    setMessage(prompt);
    inputRef.current?.focus();
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setMessage("");
    //calling api to send message
    const res = await axios.post(`${baseUrl}/chat`, {
      prompt: message,
      prevPrompts: messages,
      provider: provider,
      model: 'gemini-2.0-flash',
      threadId: currentThreadId,
      maxOutputTokens: 500,
      temperature: 0.5,
      systemPrompt: 'you are help ful asistent.',
      llmProvider: 'gemini'
    })
    if(res.data.success){
      setMessages((prev) => [...prev, { sender: "ai", text: res.data.genResponse }]);
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
