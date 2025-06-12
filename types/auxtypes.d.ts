<<<<<<< HEAD
//interface for thread
interface Thread {
  id: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
=======

//interface for thread
interface Thread {
    id: number;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
>>>>>>> 4d77aeba9b599dc50e9b2a84381492da099b9a56
}

//interface for chat
interface Chat {
<<<<<<< HEAD
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
=======
    prompt: string;
    response: string;
    provider: string;
    model: string;
    thread: Thread;
}
>>>>>>> 4d77aeba9b599dc50e9b2a84381492da099b9a56
