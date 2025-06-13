import Menubar from "@/components/Settings-comps/Menu-bar";
import Profile from "@/components/Settings-comps/Profile";
import Topbar from "@/components/Settings-comps/Topbar";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gradient-to-b from-[#f4e7f6] via-[#f1e1f4] to-[#efdaf3] min-h-screen">
      <div className="max-w-[1200px] mx-auto pt-3 px-4">
        {/* Topbar at the top */}
        <Topbar />

        {/* Content below Topbar: Profile left, Menu right */}
        <div className="flex flex-col md:flex-row gap-6 mt-6">
          {/* Profile on the left */}
          <div className="md:w-1/4 w-full">
            <Profile />
          </div>

          {/* Menubar on the right */}
          <div className="md:w-3/4 w-full">
            <Menubar />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
