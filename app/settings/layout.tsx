import Menubar from "@/components/Settings-comps/Menu-bar";
import Profile from "@/components/Settings-comps/Profile";
import Topbar from "@/components/Settings-comps/Topbar";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4e7f6] via-[#f1e1f4] to-[#efdaf3] dark:bg-[#1a1319] dark:bg-none">
      <div className="max-w-[1200px] mx-auto pt-3 px-4">
        {/* Always on top */}
        <Topbar />

        {/* Responsive Layout */}
        <div className="mt-6 flex flex-col md:flex-row gap-6">
          {/* Profile: visible on md and above */}
          <div className="hidden md:block md:w-1/4">
            <Profile />
          </div>

          {/* Menubar + children: stacked on small, side-by-side on md+ */}
          <div className="w-full md:w-3/4 flex flex-col gap-4">
            <Menubar />
            <div className="mb-4">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
