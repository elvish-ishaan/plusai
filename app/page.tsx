import ChatCard from "@/components/ChatCard/ChatCard";
import Sidebar from "@/components/Sidebar/Sidebar";

export default function Home() {
  return (
    <div className="flex bg-[#f2e6f5] h-screen overflow-hidden">
      <div className="w-[260px] shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1">
        <ChatCard />
      </div>
    </div>
  );
}
