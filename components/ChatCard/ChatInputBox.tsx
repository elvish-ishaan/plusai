  "use client";

  import { Globe, Paperclip, ArrowUp } from "lucide-react";
  import TextareaAutosize from "react-textarea-autosize";
  import ModelSelector from "./ModelSelector";
import { Input } from "../ui/input";
import { useState } from "react";
import { uploadToS3 } from "@/app/actions/uploads";

  type Props = {
    message: string;
    setMessage: (val: string) => void;
    model: string;
    setIsWebSearchEnabled: React.Dispatch<React.SetStateAction<boolean>>;
    setModel: React.Dispatch<React.SetStateAction<string>>;
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
      <div className="max-w-3xl w-full px-4 pt-4 mx-auto">
        <div
          className="relative bg-[rgba(255,255,255,0.7)] dark:bg-[#25202b] backdrop-blur-lg rounded-t-[20px] border border-[#d9b4cc] dark:border-[#403040] border-b-0 p-2 pb-0 shadow-[0_80px_50px_rgba(0,0,0,0.1),0_50px_30px_rgba(0,0,0,0.07),0_30px_15px_rgba(0,0,0,0.06),0_15px_8px_rgba(0,0,0,0.04),0_6px_4px_rgba(0,0,0,0.04),0_2px_2px_rgba(0,0,0,0.02)] outline outline-1 outline-[rgba(207,155,205,0.4)] dark:outline-[rgba(172,114,190,0.3)]"
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
              className="w-full resize-none bg-transparent text-sm text-[#a14a86] dark:text-[#91869b] placeholder-[#d088b5] dark:placeholder-[#91869b] focus:outline-none leading-6"
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
                    ? "bg-[#e4b9cb] text-white dark:bg-[#3a2134] dark:text-[#8d818b] dark:border-[#7c2e51] cursor-not-allowed"
                    : "bg-[#a23b67] hover:bg-[#d56698] text-pink-50 dark:bg-[#4b1f39] dark:border-[#7c2e51] dark:hover:bg-[#7d1d48] cursor-pointer"
                }`}
                aria-label="Send"
                onClick={() => onSend(message)}
              >
                <ArrowUp className="w-5 h-5" />
              </button>

              {/* ModelSelector, Search, Upload */}
              <div className="flex flex-wrap items-center gap-2 pr-2 mb-6">
                <div className="cursor-pointer">
                  <ModelSelector setModel={setModel} selectedModel={model} />
                </div>

                {/* Search Button */}
                <button
                  type="button"
                  onClick={() => setSelectedTool("search")}
                  className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-xl border cursor-pointer
                border-[#eddfed] dark:border-[#39323f]
                  ${
                    selectedTool === "search"
                      ? "bg-[#f4d6e7] dark:bg-[#322c38]"
                      : "hover:bg-[#f4d6e7] dark:hover:bg-[#322c38]"
                   }  text-[#ac1668] dark:text-[#f9f8fb]`}
                >
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline">Search</span>
                </button>

                {/* Paperclip file input button */}
                <div
                  className={`cursor-pointer p-1 rounded-md ${
                    selectedTool === "upload"
                      ? "bg-[#f4d6e7] dark:bg-[#322c38]"
                      : "hover:bg-[#f4d6e7] dark:hover:bg-[#322c38]"
                  }`}
                  onClick={() => setSelectedTool("upload")}
                >
                  <label className="cursor-pointer relative">
                    <Paperclip className="w-4 h-4 text-[#ac1668] dark:text-[#f9f8fb]" />
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
