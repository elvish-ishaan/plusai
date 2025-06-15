"use client";

import { useState } from "react";
import { Trash2, Upload, Download, Pin } from "lucide-react";

const historyData = [
  {
    id: 1,
    title: "Rs in strawberry",
    date: "11/06/2025, 01:22:39",
    pinned: false,
  },
  {
    id: 2,
    title: "React Chat Input Box Component with Model Selector and Toolbar",
    date: "10/06/2025, 01:35:02",
    pinned: true,
  },
];

export default function HistoryAndSync() {
  const [selected, setSelected] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selected.length === historyData.length) {
      setSelected([]);
    } else {
      setSelected(historyData.map((h) => h.id));
    }
  };

  return (
    <section className="mt-10 px-4 py-6 bg-[#f2cbe9] dark:bg-[#1c131b] rounded-xl text-[#77347c] dark:text-white shadow-md">
      <h2 className="text-xl font-semibold mb-1">Message History</h2>
      <p className="text-sm mb-4">
        Save your history as JSON, or import someone else's. Importing will NOT
        delete existing messages
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={selectAll}
          className="px-3 py-1 border rounded-md text-sm bg-[#f2e1f4] dark:bg-[#2e1b2d] dark:text-white"
        >
          Select All
        </button>
        <button className="flex items-center gap-1 px-3 py-1 border rounded-md text-sm hover:bg-[#e5c2dc] dark:hover:bg-[#32212d]">
          <Upload size={14} /> Export
        </button>
        <button className="flex items-center gap-1 px-3 py-1 border rounded-md text-sm bg-[#a74576] text-white hover:bg-[#922d61]">
          <Trash2 size={14} /> Delete
        </button>
        <button className="flex items-center gap-1 px-3 py-1 border rounded-md text-sm hover:bg-[#e5c2dc] dark:hover:bg-[#32212d]">
          <Download size={14} /> Import
        </button>
      </div>

      {/* History List */}
      <div className="border rounded-md border-[#e6b0d4] dark:border-[#3a2937] overflow-hidden text-sm">
        {historyData.map((item) => (
          <label
            key={item.id}
            className="flex justify-between items-center px-4 py-3 border-b last:border-b-0 border-[#eecce4] dark:border-[#31202c]"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selected.includes(item.id)}
                onChange={() => toggleSelect(item.id)}
              />
              <span>{item.title}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              {item.pinned && <Pin size={14} className="text-[#cc5896]" />}
              {item.date}
            </div>
          </label>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
          Danger Zone
        </h3>
        <p className="text-sm mb-3">
          If your chats from before June 1st are missing, click this to bring
          them back. Contact support if you have issues.
        </p>
        <button className="mb-4 px-4 py-2 rounded-md bg-[#a74576] text-white hover:bg-[#922d61] text-sm">
          Restore old chats
        </button>
        <p className="text-sm mb-3">
          Permanently delete your history from both your local device and our
          servers. *
        </p>
        <button className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-md text-sm">
          <Trash2 size={16} /> Delete Chat History
        </button>
        <p className="text-xs text-[#77347c] dark:text-[#b89ab5] mt-2 italic">
          * The retention policies of our LLM hosting partners may vary.
        </p>
      </div>
    </section>
  );
}
