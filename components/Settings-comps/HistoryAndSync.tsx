
import { Trash2, Upload, Download } from "lucide-react";


export default function HistoryAndSync() {


  return (
    <section className=" text-foreground dark:text-foreground ">
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
              className="form-checkbox accent-primary "
            />
            <span>Select All</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-md border text-sm hover:bg-accent dark:hover:bg-accent cursor-not-allowed">
            <Upload size={14} /> Export
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-md text-primary-foreground bg-primary hover:bg-primary/80 text-sm cursor-not-allowed">
            <Trash2 size={14} /> Delete
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-md border text-sm hover:bg-accent dark:hover:bg-accent cursor-pointer">
            <Download size={14} /> Import
          </button>
        </div>
      </div>

      {/* Message List */}
      <div className="w-full h-40 border border-border dark:border-border rounded-md flex items-center justify-center text-sm italic text-foreground dark:text-muted-foreground">
        No threads found
      </div>

      {/* Danger Zone */}
      <div className="mt-10">
        <h3 className="text-lg font-bold dark:text-foreground text-foreground mb-2">
          Danger Zone
        </h3>
        <p className="text-sm text-foreground dark:text-muted-foreground mb-3">
          If your chats from before June 1st are missing, click this to bring
          them back. Contact support if you have issues.
        </p>
        <button className="mb-4 px-4 py-2 rounded-md bg-primary hover:bg-primary/80 text-primary-foreground text-sm cursor-pointer">
          Restore old chats
        </button>

        <p className="text-sm text-foreground dark:text-muted-foreground mb-3">
          Permanently delete your history from both your local device and our
          servers.
        </p>
        <button className="flex items-center gap-2 px-4 py-2 bg-destructive hover:bg-destructive/80 text-destructive-foreground rounded-md text-sm cursor-pointer">
          <Trash2 size={16} /> Delete Chat History
        </button>
        <p className="text-xs text-foreground dark:text-muted-foreground mt-2 italic">
          * The retention policies of our LLM hosting partners may vary.
        </p>
      </div>
    </section>
  );
}
