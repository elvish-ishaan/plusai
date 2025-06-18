
import { Trash2, Upload, Download } from "lucide-react";


export default function HistoryAndSync() {


  return (
    <section className=" text-[#77347c] dark:text-white ">
      <h2 className="text-xl font-bold mb-1">Message History</h2>
      <p className="text-sm mb-4">
        Save your history as JSON, or import someone else&#39;s. Importing will
        NOT delete existing messages
      </p>

      {/* Header row: Select All & buttons */}
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <div>
          <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              className="form-checkbox accent-[#a74576] "
            />
            <span>Select All</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-md border text-sm hover:bg-[#e5c2dc] dark:hover:bg-[#32212d] cursor-not-allowed">
            <Upload size={14} /> Export
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-md text-[#e6b0d4] bg-[#a74576] hover:bg-[#922d61] text-sm cursor-not-allowed">
            <Trash2 size={14} /> Delete
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-md border text-sm hover:bg-[#e5c2dc] dark:hover:bg-[#32212d] cursor-pointer">
            <Download size={14} /> Import
          </button>
        </div>
      </div>

      {/* Message List */}
      <div className="w-full h-40 border border-[#e6b0d4] dark:border-[#3a2937] rounded-md flex items-center justify-center text-sm italic text-[#77347c] dark:text-[#bfa6bd]">
        No threads found
      </div>

      {/* Danger Zone */}
      <div className="mt-10">
        <h3 className="text-lg font-bold dark:text-white text-[#501854] mb-2">
          Danger Zone
        </h3>
        <p className="text-sm text-[#77347c] dark:text-[#b89ab5] mb-3">
          If your chats from before June 1st are missing, click this to bring
          them back. Contact support if you have issues.
        </p>
        <button className="mb-4 px-4 py-2 rounded-md bg-[#a74576] hover:bg-[#922d61] text-white text-sm cursor-pointer">
          Restore old chats
        </button>

        <p className="text-sm text-[#77347c] dark:text-[#b89ab5] mb-3">
          Permanently delete your history from both your local device and our
          servers.
        </p>
        <button className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-md text-sm cursor-pointer">
          <Trash2 size={16} /> Delete Chat History
        </button>
        <p className="text-xs text-[#77347c] dark:text-[#b89ab5] mt-2 italic">
          * The retention policies of our LLM hosting partners may vary.
        </p>
      </div>
    </section>
  );
}
