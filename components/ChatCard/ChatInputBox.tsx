"use client";

import { Globe, Paperclip, ArrowUp } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import ModelSelector from "./ModelSelector";
import { useState } from "react";
import { uploadToS3 } from "@/app/actions/uploads";

type Props = {
  message: string;
  setMessage: (val: string) => void;
  model: string;
  setIsWebSearchEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setModel: React.Dispatch<React.SetStateAction<string>>;
  setProvider?: React.Dispatch<React.SetStateAction<string>>;
  setFileUrl: React.Dispatch<React.SetStateAction<string | null>>;
  onSend: (val: string) => void;
  // inputRef: React.RefObject<HTMLTextAreaElement>;
  isLoading: boolean;
  currentThreadId?: string;
};

export default function ChatInputBox({
  message,
  setMessage,
  setIsWebSearchEnabled,
  model,
  setProvider,
  setModel,
  setFileUrl,
  onSend,
  currentThreadId,
  isLoading,
}: Props) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend(message);
    }
  };
  const [selectedTool, setSelectedTool] = useState<
    "search" | "upload" | null
  >(null);


  const isSendDisabled = message.trim() === "" || isLoading;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      //call the acion to upload the file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('threadId', currentThreadId || '')
      console.log('uploading file to s3');
      const fileUrl = await uploadToS3(formData);
      if( fileUrl.success) {
        setFileUrl(fileUrl.url || null);
      console.log(fileUrl, 'file url in chat input box');
      if (fileUrl) {
        console.log('error in uploading file to s3');
    }
  };
}
  }

  return (
    <div className=" px-4 pt-4 mx-auto">
      <div
        className="relative bg-card/70 dark:bg-card backdrop-blur-lg rounded-t-[20px] border border-border dark:border-border border-b-0 p-2 pb-0 shadow-[0_80px_50px_rgba(0,0,0,0.1),0_50px_30px_rgba(0,0,0,0.07),0_30px_15px_rgba(0,0,0,0.06),0_15px_8px_rgba(0,0,0,0.04),0_6px_4px_rgba(0,0,0,0.04),0_2px_2px_rgba(0,0,0,0.04)]"
        style={{
          //@ts-expect-error fix
          "--chat-input-gradient": "322 70% 85%",
          "--chat-input-background": "rgba(255, 255, 255, 0.7)",
        }}
      >
        <div className="flex flex-col gap-2 rounded-t-xl px-3 pt-3">
          <TextareaAutosize
            // ref={inputRef}
            minRows={2}
            maxRows={10}
            placeholder={
              isLoading ? "Please wait..." : "Type your message here..."
            }
            className="w-full resize-none bg-transparent text-sm text-foreground dark:text-foreground placeholder-muted-foreground dark:placeholder-muted-foreground focus:outline-none leading-6"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            aria-label="Message input"
          />

          {/* Toolbar */}
          <div className="-mb-px mt-2 flex flex-row-reverse justify-between items-center">
            {/* Send button */}
            <button
              disabled={isSendDisabled}
              className={`rounded-lg p-2 transition h-9 w-9 flex items-center justify-center ${
                isSendDisabled
                  ? "bg-muted text-foreground dark:bg-muted dark:text-foreground dark:border-border cursor-not-allowed"
                  : "bg-primary hover:bg-primary/80 text-primary-foreground dark:bg-primary dark:border-border dark:hover:bg-primary/80 cursor-pointer"
              }`}
              aria-label="Send"
              onClick={() => onSend(message)}
            >
              <ArrowUp className="w-5 h-5" />
            </button>

            {/* ModelSelector, Search, Upload */}
            <div className="flex flex-wrap items-center gap-2 pr-2 mb-6">
              <div className="cursor-pointer">
                <ModelSelector setModel={setModel} selectedModel={model} setProvider={setProvider} />
              </div>

              {/* Search Button */}
              <button
                type="button"
                onClick={() => {
                  setSelectedTool(selectedTool === "search" ? null : "search")
                  setIsWebSearchEnabled((prev) => !prev);
                }
                }
                className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-xl border cursor-pointer
              border-border dark:border-border
                ${
                  selectedTool === "search"
                    ? "bg-accent dark:bg-accent"
                    : "hover:bg-accent dark:hover:bg-accent"
                }  text-primary dark:text-primary-foreground`}
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
              </button>

              {/* Paperclip file input button */}
              <div
                className={`cursor-pointer p-2 rounded-md transition-colors duration-150
                ${
                  selectedTool === "upload"
                    ? "bg-accent dark:bg-accent"
                    : "bg-transparent hover:bg-accent dark:hover:bg-accent"
                }`}
                onClick={() =>
                  setSelectedTool(selectedTool === "upload" ? null : "upload")
                }
              >
                <label className="cursor-pointer relative">
                  <Paperclip className="w-4 h-4 text-primary dark:text-primary-foreground" />
                  <input
                    type="file"
                    name="file"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
