"use client";

import Link from "next/link";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Image from "next/image";
import { Button } from "../ui/button";
import logo from "../../public/logo.png";
import sidebar from "../../public/sidebar.png";
import { useMemo, useState, useEffect, useRef } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { Pin, X, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import DeleteModal from "./DeleteModal";
import { signIn, signOut } from "next-auth/react";
import axios from "axios";


const groupByDate = (threads: Thread[]) => {
  const groups: Record<string, Thread[]> = {};   
  threads.forEach((thread) => {
    const threadDate = new Date(thread?.createdAt);
    let label = format(threadDate, "PPP");

    if (isToday(threadDate)) label = "Today";
    else if (isYesterday(threadDate)) label = "Yesterday";

    if (!groups[label]) groups[label] = [];
    groups[label].push(thread);
  });
  return groups;
};

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  threads,
  setThreads,
  onThreadSelect,
  selectedThreadId,
}: {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  threads: Thread[];
  setThreads: React.Dispatch<React.SetStateAction<Thread[]>>;
  onThreadSelect: (threadId: string) => void;
  selectedThreadId: string | null;
}) {
  console.log(threads,'threads inisde sidebar..........')
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [threadToDelete, setThreadToDelete] = useState<string | null>(null);
  const hasMounted = useRef(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    hasMounted.current = true;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setIsCollapsed((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredThreads = useMemo(() => {
    return threads?.filter((thread) =>
      thread.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const grouped = useMemo(
    () => groupByDate(filteredThreads),
    [filteredThreads]
  );

  const handleDelete = async () => {
    if (!threadToDelete) return;
    
    try {
      const response = await axios.delete(`${baseUrl}/api/chat/threads?threadId=${threadToDelete}`);
      if (response.data.success) {
        setThreads(prev => prev.filter(thread => thread.id !== threadToDelete));
        if (selectedThreadId === threadToDelete) {
          onThreadSelect(null);
        }
      }
    } catch (error) {
      console.error('Error deleting thread:', error);
    }
    setShowModal(false);
    setThreadToDelete(null);
  };

  const handleThreadClick = (threadId: string) => {
    onThreadSelect(threadId);
  };

  const handleNewChat = () => {
    onThreadSelect(null);
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 100 : 240 }}
      transition={
        hasMounted.current
          ? { duration: 0.3, ease: "easeInOut" }
          : { duration: 0 }
      }
      className={`${
        isCollapsed
          ? "absolute left-0 top-0 z-30 h-[48px] flex items-center bg-[#f3e6f5] shadow-md m-3 rounded-lg"
          : "relative h-full"
      } bg-[#f3e6f5] flex flex-col overflow-hidden`}
    >
      {isCollapsed ? (
        // Collapsed view with evenly spaced icons
        <div className="flex items-center justify-around  h-full px-1.5 py-1.5">
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-1 text-[#a74576] hover:bg-[#f0cde4] rounded-md"
            aria-label="Expand sidebar"
          >
            <Image
              src={sidebar}
              alt="Sidebar Icon"
              width={24}
              height={24}
              style={{
                filter:
                  "brightness(0.2) saturate(100%) invert(18%) sepia(51%) saturate(3635%) hue-rotate(304deg) brightness(90%) contrast(94%)",
              }}
            />
          </button>
          <div className="text-[#a74576] hover:bg-[#f0cde4] p-1 rounded-md cursor-pointer">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M21 21l-4.35-4.35m1.65-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="text-[#a74576] hover:bg-[#f0cde4] p-1 rounded-md cursor-pointer">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>
      ) : (
        // Expanded sidebar view
        <>
          {/* Top controls and logo */}
          <div className="px-3 py-3 flex flex-col gap-3 mt-3">
            <div className="relative flex items-center justify-between">
              <button
                onClick={() => setIsCollapsed(true)}
                className="p-1 text-[#a74576] hover:bg-[#f0cde4] rounded-md"
                aria-label="Collapse sidebar"
              >
                <Image
                  src={sidebar}
                  alt="Sidebar Icon"
                  width={20}
                  height={20}
                  style={{
                    filter:
                      "brightness(0.2) saturate(100%) invert(18%) sepia(51%) saturate(3635%) hue-rotate(304deg) brightness(90%) contrast(94%)",
                  }}
                />
              </button>
              <Link
                href="/"
                className="flex items-center justify-center flex-grow"
              >
                <Image src={logo} alt="T3.chat" height={18} />
              </Link>
            </div>

            <Button 
              onClick={handleNewChat}
              className="w-full mt-2 bg-[#a23b67] hover:bg-[#d56a9d] text-white font-bold py-2 border border-[#8f3c66] rounded-lg shadow text-sm"
            >
              New Chat
            </Button>

            {/* Search box */}
            <div className="text-sm font-normal">
              <div className="flex items-center gap-3 text-[#a74576] border-b border-[#efbdeb] px-1 py-2 focus-within:ring-2 focus-within:ring-[#a74576] transition">
                <svg
                  className="w-4 h-4 text-[#ac1668]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 21l-4.35-4.35m1.65-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="search"
                  placeholder="Search your threads..."
                  className="bg-transparent outline-none w-full text-sm placeholder:text-[#cf7dae]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          {/* Thread List */}
          <nav
            aria-label="Thread list"
            className="flex-grow overflow-y-auto px-2 space-y-1 scrollbar-hide"
          >
            {Object.keys(grouped).length === 0 ? (
              <p className="text-xs text-[#a74576] pl-1">No threads found</p>
            ) : (
              Object.entries(grouped).map(([dateLabel, threads]) => (
                <div key={dateLabel}>
                  {!isCollapsed && (
                    <h4 className="text-xs font-medium text-black my-1.5 pl-1">
                      {dateLabel}
                    </h4>
                  )}
                  <div className="space-y-0.5 mt-2">
                    {threads?.map((thread) => (
                      <motion.div
                        key={thread.id}
                        className={`relative group cursor-pointer ${
                          selectedThreadId === thread.id ? 'bg-[#efcae3]' : ''
                        }`}
                        initial="rest"
                        animate="rest"
                        whileHover="hover"
                        onClick={() => handleThreadClick(thread.id)}
                      >
                        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[#efcae3]">
                          <div className="flex items-center gap-2 min-w-0">
                            <MessageSquare className="w-4 h-4 text-[#7a375b] flex-shrink-0" />
                            <span className="text-sm text-[#7a375b] truncate">
                              {thread.title}
                            </span>
                          </div>
                          {!isCollapsed && (
                            <motion.div
                              variants={{
                                rest: { x: 20, opacity: 0 },
                                hover: { x: 0, opacity: 1 },
                              }}
                              transition={{ duration: 0.1, ease: "easeInOut" }}
                              className="relative z-10 flex gap-1 text-[#7a375b]"
                            >
                              <span className="p-1 hover:bg-pink-300 rounded-md">
                                <Pin className="w-4 h-4 cursor-pointer" />
                              </span>
                              <span 
                                className="p-1 hover:bg-pink-300 rounded-md"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setThreadToDelete(thread.id);
                                  setShowModal(true);
                                }}
                              >
                                <X className="w-4 h-4 cursor-pointer" />
                              </span>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </nav>

          {/* Bottom User Info */}
          <div className="p-4 border-[#e6c4de] mb-3">
            <div className="flex items-center space-x-3 hover:bg-white px-2 py-3 rounded-lg cursor-pointer">
              <Avatar>
                <AvatarFallback className="bg-blue-600 text-white">
                  P
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <Button onClick={() => { signIn() }}>Log In</Button>
                <Button onClick={() => { signOut() }}>log out</Button>
                <p className="text-xs text-[#a74576] truncate">Free</p>
              </div>
            </div>
          </div>

          <DeleteModal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setThreadToDelete(null);
            }}
            onDelete={handleDelete}
            threadTitle={threads.find(t => t.id === threadToDelete)?.title || ''}
          />
        </>
      )}
    </motion.aside>
  );
}
