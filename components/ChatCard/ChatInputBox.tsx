"use client";

import { Globe, Paperclip, ArrowUp, Pause } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import ModelSelector from "./ModelSelector";
import { useState } from "react";
import { uploadToS3 } from "@/app/actions/uploads";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

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
  isPaused?: boolean;
  setIsPaused?: React.Dispatch<React.SetStateAction<boolean>>;
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
  isPaused,
  setIsPaused,
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
  const {data: session} = useSession();

  const isSendDisabled = message.trim() === "" || isLoading;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!session?.user?.id){
      toast.error("You need to be logged in to upload files");
      return;
    }
    const file = e.target.files?.[0];
    if (file) {
      //call the acion to upload the file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('threadId', currentThreadId || '')
      console.log('uploading file to s3');
      const toastId = toast.loading("Uploading file...");
      const fileUrl = await uploadToS3(formData);
      if( fileUrl.success) {
        setFileUrl(fileUrl.url || null);
        toast.success("File uploaded successfully!", { id: toastId });
      console.log(fileUrl, 'file url in chat input box');
      if (!fileUrl.success) {
        toast.error("Failed to upload file", { id: toastId });
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
              disabled={isLoading ? false : isSendDisabled}
              className={`rounded-lg p-2 transition h-8 w-8 flex items-center justify-center mb-4 ${
                isLoading
                  ? "bg-[#a23b67] hover:bg-[#d56698] text-pink-50 dark:bg-[#4b1f39] dark:hover:bg-[#7d1d48] cursor-pointer"
                  : isSendDisabled
                  ? "bg-[#e4b9cb] text-white dark:bg-[#3a2134] dark:text-[#8d818b] dark:border-[#7c2e51] cursor-not-allowed"
                  : "bg-[#a23b67] hover:bg-[#d56698] text-pink-50 dark:bg-[#4b1f39] dark:border-[#7c2e51] dark:hover:bg-[#7d1d48] cursor-pointer"
              }`}
              aria-label={isLoading ? (isPaused ? "Resume" : "Pause") : "Send"}
              onClick={() => {
                if (isLoading) {
                  // While generating response, toggle pause
                  setIsPaused?.((prev) => !prev);
                } else if (message.trim() !== "") {
                  // Send message
                  onSend(message);
                  setIsPaused?.(false); // Reset pause state on new message
                }
              }}
            >
              {isLoading ? (
                isPaused ? (
                  <ArrowUp className="w-5 h-5" />
                ) : (
                  <Pause className="w-5 h-5" />
                )
              ) : (
                <ArrowUp className="w-5 h-5" />
              )}
            </button>

            {/* ModelSelector, Search, Upload */}
            <div className="flex flex-wrap items-center gap-2 pr-2 mb-6">
              <div className="cursor-pointer">
                <ModelSelector
                  setModel={setModel}
                  selectedModel={model}
                  setProvider={setProvider}
                />
              </div>

              {/* Search Button */}
              <button
                type="button"
                onClick={() => {
                  setSelectedTool(selectedTool === "search" ? null : "search");
                  setIsWebSearchEnabled((prev) => !prev);
                }}
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
                    disabled={ session?.user?.id ? false : true }
                    type="file"
                    name="file"
                    onChange={handleFileUpload}
                    className={ session?.user?.id ? "absolute inset-0 w-full h-full opacity-0 cursor-pointer" : "absolute inset-0 w-full h-full opacity-0 cursor-not-allowed"}
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
