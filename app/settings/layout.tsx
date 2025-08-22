import Menubar from "@/components/Settings-comps/Menu-bar";
import Profile from "@/components/Settings-comps/Profile";
import Topbar from "@/components/Settings-comps/Topbar";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gradient-to-b from-background via-background to-background dark:bg-background dark:bg-none w-full h-screen md:min-h-screen overflow-y-auto">
      <div className="w-full h-full md:w-fit max-w-[1200px] mx-auto pt-3 px-4">
        {/* Always on top */}
        <Topbar />

        {/* Responsive Layout */}
        <div className="mt-6 flex flex-col md:flex-row gap-6 h-full">
          {/* Profile: visible on md and above */}
          <div className="hidden md:block md:w-1/4">
            <Profile />
          </div>

          {/* Menubar + children: stacked on small, side-by-side on md+ */}
          <div className="w-full md:w-3/4 flex flex-col gap-4 h-full">
            <Menubar />
            <div className="mb-4 flex-grow">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
