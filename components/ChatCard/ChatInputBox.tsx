"use client";

import { Globe, Paperclip, ArrowUp } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import ModelSelector from "./ModelSelector";

type Props = {
  message: string;
  setMessage: (val: string) => void;
  setModel: React.Dispatch<React.SetStateAction<string>>;
  onSend: (val: string) => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  isLoading: boolean;
};

export default function ChatInputBox({
  message,
  setMessage,
  setModel,
  onSend,
  inputRef,
  isLoading,
}: Props) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend(message);
    }
  };

  const isSendDisabled = message.trim() === "" || isLoading;

  return (
    <div className="max-w-4xl mx-auto w-full px-4 pt-4 pb-2">
      <div
        className="relative bg-[rgba(255,255,255,0.7)] dark:bg-[#25202b] backdrop-blur-lg rounded-t-[20px] border border-[#d9b4cc] dark:border-[#403040] border-b-0 p-2 pb-0 shadow-[0_80px_50px_rgba(0,0,0,0.1),0_50px_30px_rgba(0,0,0,0.07),0_30px_15px_rgba(0,0,0,0.06),0_15px_8px_rgba(0,0,0,0.04),0_6px_4px_rgba(0,0,0,0.04),0_2px_2px_rgba(0,0,0,0.02)] outline outline-1 outline-[rgba(207,155,205,0.4)] dark:outline-[rgba(172,114,190,0.3)]"
        style={{
          //@ts-ignore
          "--chat-input-gradient": "322 70% 85%",
          "--chat-input-background": "rgba(255, 255, 255, 0.7)",
        }}
      >
        <div className="flex flex-col gap-2 rounded-t-xl px-3 pt-3">
          <TextareaAutosize
            ref={inputRef}
            minRows={2}
            maxRows={10}
            placeholder={
              isLoading ? "Please wait..." : "Type your message here..."
            }
            className="w-full resize-none bg-transparent text-sm text-[#a14a86] dark:text-[#91869b] placeholder-[#d088b5] dark:placeholder-[#91869b] focus:outline-none leading-6"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            aria-label="Message input"
          />

          {/* Toolbar */}
          <div className="-mb-px mt-2 flex flex-row-reverse justify-between items-center">
            <button
              disabled={isSendDisabled}
              className={`rounded-lg p-2 transition h-9 w-9 flex items-center justify-center cursor-pointer ${
                isSendDisabled
                  ? "bg-[#e4b9cb] text-white cursor-not-allowed dark:bg-[#3a2134] dark:text-[#8d818b] dark:border-[#7c2e51] "
                  : "bg-[#a23b67] hover:bg-[#d56698] text-pink-50 dark:bg-[#4b1f39] dark:border-[#7c2e51] dark:hover:bg-[#7d1d48]"
              }`}
              aria-label="Send"
              onClick={() => onSend(message)}
            >
              <ArrowUp className="w-5 h-5" />
            </button>

            <div className="flex flex-col gap-2 pr-2 sm:flex-row sm:items-center mb-6">
              <div className="flex items-center gap-2">
                <ModelSelector setModel={setModel} disabled={isLoading} />
                <button
                  className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-xl border border-[#eddfed] dark:border-[#39323f] text-[#ac1668] dark:text-[#f9f8fb] hover:bg-[#f4d6e7] dark:hover:bg-[#322c38]"
                  type="button"
                >
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline">Search</span>
                </button>
                <button
                  className="text-xs px-2 py-1.5 rounded-xl border border-[#eddfed] dark:border-[#39323f] text-[#ac1668] hover:bg-[#f4d6e7] dark:text-[#f9f8fb] dark:hover:bg-[#322c38]"
                  type="button"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
