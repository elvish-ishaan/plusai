import axios from "axios";
import { useEffect, useState } from "react";




export default function Attachments() {
  //fetching all attachments of user
  const [attachments, setAttachments] = useState<attachmentMetaData[]>([]);
  useEffect(() => {
    const fetchAttachments = async () => {
      try {
        const res = await axios.get("/api/chat/attachments");
        if (res.data.success) {
          setAttachments(res.data.attachments);
        }
      } catch (error) {
        console.error("Failed to fetch attachments:", error);
      }
    };
    fetchAttachments();
  }, []);

  if (attachments.length > 0) {
    return (
      <div className="flex flex-col gap-3 mt-10">
        {attachments.map((attachment: attachmentMetaData) => (
          <div key={attachment.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <p className="text-sm font-medium">{attachment.id}</p>
                <p className="text-xs text-primary dark:text-primary">
                  {attachment.url}
                </p>
              </div>
            </div>
            <button className="bg-primary hover:bg-primary/80 text-primary-foreground font-bold py-2 px-4 rounded-lg shadow">
              Delete
            </button>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="text-center mt-10 text-primary dark:text-primary text-md ">
      No attachments found
    </div>
  );
}
