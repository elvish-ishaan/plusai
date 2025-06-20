"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import logo from "../../public/logo.png";
import darklogo from "../../public/darklogo.png";
import sidebar from "../../public/sidebar.png";
import { useMemo, useState, useEffect, useRef } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { Pin, PinOff, X } from "lucide-react";
import { motion } from "framer-motion";
import DeleteModal from "./DeleteModal";
import UserInfo from "./UserInfo";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

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
}: {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  threads: Thread[];
  setThreads: React.Dispatch<React.SetStateAction<Thread[]>>;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [threadToDelete, setThreadToDelete] = useState<string | null>(null);
  const hasMounted = useRef(false);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const handleThreadClick = (threadId: string) => {
    setSelectedThreadId(threadId);
    router.push(`/chat/${threadId}`);
  };

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
  }, [setIsCollapsed]);

  const filteredThreads = useMemo(() => {
    return threads?.filter((thread) =>
      thread.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, threads]);

  // Get pinned threads from the actual thread data
  const pinnedThreads = useMemo(() => {
    return filteredThreads.filter(thread => thread.pinned);
  }, [filteredThreads]);

  // Get unpinned threads for grouping by date
  const unpinnedThreads = useMemo(() => {
    return filteredThreads.filter(thread => !thread.pinned);
  }, [filteredThreads]);

  const grouped = useMemo(
    () => groupByDate(unpinnedThreads),
    [unpinnedThreads]
  );

  const handleDelete = async () => {
    if (!threadToDelete) return;

    try {
      const response = await axios.delete("/api/chat/threads", {
        data: { threadId: threadToDelete },
      });

      if (response.data.success) {
        setThreads((prev) =>
          prev.filter((thread) => thread.id !== threadToDelete)
        );
        router.push("/"); // Redirect to home after deletion
      }
    } catch (error) {
      console.error("Failed to delete thread:", error);
    } finally {
      setShowModal(false);
      setThreadToDelete(null);
    }
  };

  // Combined pin/unpin function
  const togglePinThread = async (threadId: string, currentPinnedState: boolean) => {
    try {
      // Use consistent API endpoint
      const response = await axios.patch(`/api/chat/threads/${threadId}`, {
        pinned: !currentPinnedState
      });
      
      if (!response.data.success) {
        console.error("Failed to toggle pin:", response.data.message);
        return;
      }

      // Update the thread's pinned state
      setThreads((prev) =>
        prev.map((thread) =>
          thread.id === threadId 
            ? { ...thread, pinned: !currentPinnedState } 
            : thread
        )
      );
      
    } catch (error) {
      console.error("Failed to toggle pin:", error);
    }
  };

  const handleNewChat = () => {
    router.push("/");
  };

  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true); // wait for client mount to access `theme` safely
  }, []);
  const lightFilter =
    "brightness(0.2) saturate(100%) invert(19%) sepia(47%) saturate(3761%) hue-rotate(309deg) brightness(95%) contrast(88%)"; // for #b8387f

    const darkFilter =
      "invert(89%) sepia(9%) saturate(388%) hue-rotate(286deg) brightness(96%) contrast(93%)";
  
  const appliedFilter = theme === "dark" ? darkFilter : lightFilter;
  
  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 100 : 270 }}
      transition={
        hasMounted.current
          ? { duration: 0.3, ease: "easeInOut" }
          : { duration: 0 }
      }
      className={`${
        isCollapsed
          ? "absolute left-0 top-0 z-30 h-[42px] flex items-center p-3 rounded-md mt-3 ml-2"
          : "relative h-full"
      } bg-[#f3e6f5] dark:bg-[#1d131b] flex flex-col overflow-hidden `}
    >
      {isCollapsed ? (
        // Collapsed is present in the sidebar
        <div className="flex items-center justify-around  h-full px-1.5 py-1">
          <button
            onClick={() => setIsCollapsed(false)}
            className="min-w-[32px] min-h-[32px] p-1 text-[#a74576] dark:text-[#e7d0dd] dark:bg-[#19171d] hover:bg-[#f0cde4] dark:hover:bg-[#261922] rounded-md cursor-pointer"
            aria-label="Expand sidebar"
          >
            {mounted && (
              <Image
                src={sidebar}
                alt="Sidebar Icon"
                width={24}
                height={24}
                className="min-w-[24px] min-h-[24px]"
                style={{
                  filter: appliedFilter,
                }}
              />
            )}
          </button>

          <div className="text-[#a74576] dark:text-[#e7d0dd]  hover:bg-[#f0cde4] dark:hover:bg-[#261922] p-1 rounded-md cursor-pointer">
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
          <div className="text-[#a74576] dark:text-[#e7d0dd]  hover:bg-[#f0cde4] dark:hover:bg-[#261922] p-1 rounded-md cursor-pointer">
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
                className="p-1 text-[#a74576] hover:bg-[#f0cde4] dark:text-white dark:hover:bg-[#2b222c] rounded-md"
                aria-label="Collapse sidebar"
              >
                <Image
                  src={sidebar}
                  alt="Sidebar Icon"
                  width={20}
                  height={20}
                  style={{
                    color: "transparent",
                    filter: mounted ? appliedFilter : undefined, // prevent hydration mismatch
                  }}
                />
              </button>
              <Link
                href="/"
                className="flex items-center justify-center mx-auto pr-8"
              >
                {/* Light logo (default) */}
                <Image
                  src={logo}
                  alt="T3.chat"
                  height={18}
                  className="block dark:hidden"
                />
                {/* Dark logo */}
                <Image
                  src={darklogo}
                  alt="T3.chat"
                  height={15}
                  className="hidden dark:block"
                />
              </Link>
            </div>

            <Button
              onClick={() => handleNewChat()}
              className="w-full mt-2 bg-[#a23b67] hover:bg-[#d56a9d] dark:bg-[#3b1127] dark:hover:bg-[#791840] cursor-pointer text-white font-bold py-2 border border-[#8f3c66] rounded-lg shadow text-sm"
            >
              New Chat
            </Button>

            {/* Search box */}
            <div className="text-sm font-normal">
              <div className="flex items-center gap-3 text-[#a74576] border-b border-[#efbdeb] dark:border-[#322028] px-1 py-2  transition">
                <svg
                  className="w-4 h-4 text-[#ac1668] dark:text-[#e7d0dd]"
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
                  className="outline-none border-none dark:bg-[#1b131a] dark:placeholder-[#81727b] dark:text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  spellCheck={false}
                  autoComplete="on"
                />
              </div>
            </div>
          </div>

          <nav
            aria-label="Thread list"
            className="flex-grow overflow-y-auto px-2 space-y-1 scrollbar-hide"
          >
            {/* Show pinned section only if there are pinned threads */}
            {pinnedThreads.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-[#560f2b] dark:text-[#c46095] my-1.5 pl-1">
                  Pinned
                </h4>
                <div className="space-y-0.5 mt-2">
                  {pinnedThreads.map((thread) => (
                    <motion.div
                      key={thread.id}
                      className={`relative group cursor-pointer ${
                        selectedThreadId === thread.id
                          ? "bg-[#efcae3] dark:bg-[#261922]"
                          : ""
                      }`}
                      initial="rest"
                      animate="rest"
                      whileHover="hover"
                      onClick={() => handleThreadClick(thread.id)}
                    >
                      <div className="relative flex justify-between items-center rounded-md px-2 py-1 overflow-hidden truncate">
                        <motion.div
                          className="absolute inset-0 bg-white dark:bg-[#261922] z-0"
                          variants={{
                            rest: { x: "100%" },
                            hover: { x: "0%" },
                          }}
                          transition={{ duration: 0.1, ease: "easeInOut" }}
                        />
                        <div className="relative z-10 flex items-center truncate text-[#ac1668] dark:text-[#e7d0dd]">
                          <Link href={`/chat/${thread.id}`}>
                            {!isCollapsed ? (
                              <span className="text-sm font-medium">
                                {thread.title}
                              </span>
                            ) : (
                              <PinOff className="w-4 h-4" />
                            )}
                          </Link>
                        </div>
                        {!isCollapsed && (
                          <motion.div
                            variants={{
                              rest: { x: 20, opacity: 0 },
                              hover: { x: 0, opacity: 1 },
                            }}
                            transition={{ duration: 0.1, ease: "easeInOut" }}
                            className="relative z-10 flex gap-1 text-foreground"
                          >
                            <span
                              className="p-1 hover:bg-pink-300 dark:hover:bg-[#312630] rounded-md"
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePinThread(thread.id, thread.pinned);
                              }}
                            >
                              <PinOff className="w-4 h-4 cursor-pointer" />
                            </span>
                            <span
                              className="p-1 hover:bg-pink-300 dark:hover:bg-[#611837] rounded-md"
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
            )}

            {/* Regular threads section below */}
            {Object.keys(grouped).length === 0 && pinnedThreads.length === 0 ? (
              <p className="text-xs text-[#560f2b] dark:text-[#c46095] pl-1">
                No threads found
              </p>
            ) : (
              Object.entries(grouped).map(([dateLabel, threads]) => (
                <div key={dateLabel}>
                  {!isCollapsed && (
                    <h4 className="text-xs font-medium text-[#560f2b] dark:text-[#c46095] my-1.5 pl-1">
                      {dateLabel}
                    </h4>
                  )}
                  <div className="space-y-0.5 mt-2">
                    {threads.map((thread) => (
                      <motion.div
                        key={thread.id}
                        className={`relative group cursor-pointer ${
                          selectedThreadId === thread.id
                            ? "bg-[#efcae3] dark:bg-[#261922]"
                            : ""
                        }`}
                        initial="rest"
                        animate="rest"
                        whileHover="hover"
                        onClick={() => handleThreadClick(thread.id)}
                      >
                        <div className="relative flex justify-between items-center rounded-md px-2 py-1 overflow-hidden truncate">
                          <motion.div
                            className="absolute inset-0 bg-white dark:bg-[#261922] z-0"
                            variants={{
                              rest: { x: "100%" },
                              hover: { x: "0%" },
                            }}
                            transition={{ duration: 0.1, ease: "easeInOut" }}
                          />
                          <div className="relative z-10 flex items-center truncate text-[#ac1668] dark:text-[#e7d0dd]">
                            <Link href={`/chat/${thread.id}`}>
                              {!isCollapsed ? (
                                <span className="text-sm font-medium">
                                  {thread.title}
                                </span>
                              ) : (
                                <Pin className="w-4 h-4" />
                              )}
                            </Link>
                          </div>
                          {!isCollapsed && (
                            <motion.div
                              variants={{
                                rest: { x: 20, opacity: 0 },
                                hover: { x: 0, opacity: 1 },
                              }}
                              transition={{
                                duration: 0.1,
                                ease: "easeInOut",
                              }}
                              className="relative z-10 flex gap-1"
                            >
                              <span
                                className="p-1 hover:bg-pink-300 dark:hover:bg-[#312630] rounded-md"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePinThread(thread.id, thread.pinned);
                                }}
                              >
                                <Pin className="w-4 h-4 cursor-pointer" />
                              </span>
                              <span
                                className="p-1 hover:bg-pink-300 dark:hover:bg-[#611837] rounded-md"
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

          <UserInfo />
        </>
      )}

      <DeleteModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setThreadToDelete(null);
        }}
        onDelete={handleDelete}
        threadTitle={threads.find((t) => t.id === threadToDelete)?.title || ""}
      />
    </motion.aside>
  );
}