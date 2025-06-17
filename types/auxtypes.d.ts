

interface Thread {
  id: string; 
  title: string;
  createdAt: Date;
  pinned: boolean;
  updatedAt: Date;
  userId: string;
}

interface Chat {
  prompt: string;
  response: string;
  provider: string;
  model: string;
  thread: string;
  userId: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Message {
  sender: "user" | "ai" | "system";
  text: string;
}

interface MessageProps {
  messages: Message[];
  message: string;
  onPromptSelect: (prompt: string) => void;
  loading: boolean;
}

interface attachmentMetaData {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  threadId: string;
  createdAt: Date;
  userid: string;
}
