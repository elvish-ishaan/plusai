//interface for thread
interface Thread {
  id: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

//interface for chat
interface Chat {
  prompt: string;
  response: string;
  provider: string;
  model: string;
  thread: Thread;
}


interface MessageProps {
  messages: Message[];
  message: string;
  onPromptSelect: (prompt: string) => void;
  loading: boolean;
}
export type Message = {
  text: string;
  sender: string;
};