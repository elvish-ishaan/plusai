
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
    response: string | null;
    provider?: string;
    model?: string;
    thread?: Thread;
    createdAt?: Date;
    id?: string;
    updatedAt?: Date;
    threadId?: string;
}
