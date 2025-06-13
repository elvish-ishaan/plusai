


interface Thread {
  id: string; 
  title: string;
  createdAt: Date;
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