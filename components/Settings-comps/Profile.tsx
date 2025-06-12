"use client";

import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Profile() {
  const { data: session } = useSession();

  const userName = session?.user?.name ?? "Anonymous";
  const userEmail = session?.user?.email ?? "No Email";

  return (
    <div className="space-y-6 px-4 py-6 w-full md:max-w-xs">
      {/* Avatar and User Info */}
      <div className="text-center">
        <Avatar className="w-32 h-32 mx-auto">
          <AvatarImage src="" alt={userName} />
          <AvatarFallback className="text-4xl bg-blue-500 text-white">
            {userName?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        <h1 className="mt-4 text-xl font-bold">{userName}</h1>
        <p className="text-sm text-muted-foreground break-all">{userEmail}</p>
        <span className="mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium bg-pink-100 text-[#77347c]">
          Free Plan
        </span>
      </div>

      {/* Message Usage */}
      <div className="space-y-4 rounded-lg bg-white p-4 shadow-sm">
        <div className="flex flex-row justify-between">
          <span className="text-sm font-semibold">Message Usage</span>
          <span className="text-xs text-pink-700">
            Resets tomorrow at 5:30 AM
          </span>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-medium">Standard</h3>
            <span className="text-sm text-pink-700">0/20</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-pink-100">
            <div
              className="h-full rounded-full bg-pink-500"
              style={{ width: "0%" }}
            ></div>
          </div>
          <p className="text-sm text-pink-700 mt-1">20 messages remaining</p>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="space-y-4 rounded-lg bg-white p-4 shadow-sm">
        <span className="text-sm font-semibold">Keyboard Shortcuts</span>
        <div className="space-y-3">
          {[
            { label: "Search", keys: ["Ctrl", "K"] },
            { label: "New Chat", keys: ["Ctrl", "Shift", "O"] },
            { label: "Toggle Sidebar", keys: ["Ctrl", "B"] },
          ].map(({ label, keys }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-sm font-medium">{label}</span>
              <div className="flex gap-1">
                {keys.map((key) => (
                  <kbd
                    key={key}
                    className="rounded bg-[#f1cbe9] px-2 py-1 text-sm text-[#77347c]"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
