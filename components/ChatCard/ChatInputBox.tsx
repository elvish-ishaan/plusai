"use client";

import { useState } from "react";
import { Globe, Paperclip, ChevronUp } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import ModelSelector from "./ModelSelector";

export default function ChatInputBox() {
  const [message, setMessage] = useState("");

  return (
    <div className="max-w-3xl mx-auto w-full px-4 pt-4 pb-2">
      <div className="relative rounded-2xl shadow-md overflow-hidden">
        {/* Top thick border with rounded corners */}
        <div className="absolute top-0 left-0 right-0 h-6 rounded-t-2xl bg-[#fadefd] pointer-events-none"></div>

        <div className="bg-white rounded-t-2xl px-4 py-3 flex flex-col justify-between relative z-10">
          {/* Auto-expanding Text Input */}
          <TextareaAutosize
            minRows={2}
            maxRows={10}
            placeholder="Type your message here..."
            className="w-full resize-none bg-white focus:outline-none text-[#a14a86] placeholder-[#d088b5] text-sm mb-2 pr-12"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {/* Toolbar at bottom */}
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-2 text-[#c71680] font-semibold text-sm">
              <ModelSelector />

              <button className="flex items-center gap-1 bg-white/50 px-3 py-1 rounded-full text-[#c71680] text-sm hover:bg-white">
                <Globe className="w-4 h-4" />
                <span>Search</span>
              </button>

              <button className="bg-white/50 hover:bg-white text-[#c71680] rounded-full p-1.5">
                <Paperclip className="w-4 h-4" />
              </button>
            </div>

            <button
              className="bg-[#c988b4] hover:bg-[#c073a8] text-white rounded-lg p-1.5 transition"
              aria-label="Send"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
