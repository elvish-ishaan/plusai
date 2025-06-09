"use client";

import Link from "next/link";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Image from "next/image";
import { Button } from "../ui/button";
import logo from "../../public/logo.png";
import sidebar from "../../public/sidebar.png";
import { useMemo, useState } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { Pin, X } from "lucide-react";
import { motion } from "framer-motion";

const dummyThreads = [
  { id: 1, title: "Chat with Alice", date: "2025-06-10T10:00:00Z" },
  { id: 2, title: "Project Discussion", date: "2025-06-10T15:30:00Z" },
  { id: 3, title: "Random Talk", date: "2025-06-10T09:00:00Z" },

];

const groupByDate = (threads: any[]) => {
  const groups: Record<string, any[]> = {};
  threads.forEach((thread) => {
    const threadDate = new Date(thread.date);
    let label = format(threadDate, "PPP");

    if (isToday(threadDate)) {
      label = "Today";
    } else if (isYesterday(threadDate)) {
      label = "Yesterday";
    }

    if (!groups[label]) groups[label] = [];
    groups[label].push(thread);
  });
  return groups;
};

export default function Sidebar() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredThreads = useMemo(() => {
    return dummyThreads.filter((thread) =>
      thread.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const grouped = useMemo(
    () => groupByDate(filteredThreads),
    [filteredThreads]
  );

  return (
    <aside className="h-screen w-full bg-[#f3e6f5] flex flex-col">
      {/* Top Section */}
      <div className="px-4 py-3 border-[#c97ebb] flex flex-col gap-3 mt-3">
        <div className="relative flex items-center">
          <Button
            variant="ghost"
            className="absolute left-0 p-1 cursor-pointer text-[#a74576] rounded-md"
            aria-label="Toggle sidebar"
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
          </Button>
          <div className="flex-grow flex justify-center">
            <Link href="/" className="flex items-center">
              <Image src={logo} alt="T3.chat" height={18} />
            </Link>
          </div>
        </div>

        {/* New Chat Button */}
        <Button className="w-full mt-2 bg-[#a23b67] hover:bg-[#923c66] text-white font-bold py-2 rounded-lg shadow text-sm">
          New Chat
        </Button>

        {/* Search */}
        <div className="text-sm font-normal">
          <label htmlFor="search-threads" className="sr-only">
            Search your threads...
          </label>
          <div className="flex items-center gap-3 text-[#a74576] border-b border-[#efbdeb] px-1 py-2 focus-within:ring-2 focus-within:ring-[#a74576] transition">
            <svg
              className="w-4 h-4 flex-shrink-0 text-[#ac1668]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M21 21l-4.35-4.35m1.65-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="search-threads"
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
        className="w-full flex flex-col flex-grow overflow-y-auto px-4 space-y-1 scrollbar-hide"
      >
        {Object.keys(grouped).length === 0 ? (
          <p className="text-xs text-[#a74576]">No threads found</p>
        ) : (
          Object.entries(grouped).map(([dateLabel, threads]) => (
            <div key={dateLabel}>
              <h4 className="text-xs font-medium text-black my-1.5 pl-1">
                {dateLabel}
              </h4>
              <div className="space-y-0.5 mt-2">
                {threads.map((thread) => {
                  const isCurrent = isToday(new Date(thread.date));
                  return (
                    <motion.div
                      key={thread.id}
                      className="relative group"
                      initial="rest"
                      animate="rest"
                      whileHover="hover"
                    >
                      <Link
                        href={`/thread/${thread.id}`}
                        className="relative flex justify-between items-center rounded-md px-2 py-0.5  overflow-hidden truncate"
                      >
                        {/* Animated white background */}
                        <motion.div
                          className="absolute inset-0 bg-white z-0"
                          variants={{
                            rest: { x: "100%" },
                            hover: { x: "0%" },
                          }}
                          transition={{ duration: 0.1, ease: "easeInOut" }}
                        />

                        {/* Content */}
                        <div className="relative z-10 flex items-center truncate text-[#ac1668]">
                          <span className="text-sm font-medium">
                            {thread.title}
                          </span>
                          <div className="absolute left-full ml-2 bg-white text-[#ac1668] font-normal text-sm px-1 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {thread.title}
                          </div>
                        </div>

                        {/* Icons */}
                        <motion.div
                          variants={{
                            rest: { x: 20, opacity: 0 },
                            hover: { x: 0, opacity: 1 },
                          }}
                          transition={{ duration: 0.1, ease: "easeInOut" }}
                          className="relative z-10 flex gap-1 text-[#7a375b] my-1"
                        >
                          <span className="p-1 hover:bg-pink-300 rounded-md">
                            <Pin className="w-4 h-4 cursor-pointer" />
                          </span>
                          <span className="p-1 hover:bg-pink-300 rounded-md">
                            <X className="w-4 h-4 cursor-pointer" />
                          </span>
                        </motion.div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-[#e6c4de]">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback>P</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">Piyush Zingade</p>
            <p className="text-xs text-[#a74576] truncate">Free</p>
          </div>
        </div>
      </div>
    </aside>
  );
}


