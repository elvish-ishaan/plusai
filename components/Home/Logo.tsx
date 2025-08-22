import { Sparkles } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-purple-500 text-white shadow-md">
        <Sparkles size={20} />
      </div>
      <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
        PLUS AI
      </span>
    </div>
  );
}
