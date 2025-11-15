import HomePage from "@/components/Home/HomePage";
import { Suspense } from "react";

export default function Page() {
  return (
   <Suspense
  fallback={
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_center,var(--background)_20%,oklch(0.235_0.017_290)_100%)]">
      <div className="flex items-center gap-2 rounded-md bg-card px-4 py-2 shadow-sm">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent"></span>
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    </div>
  }
>
  <HomePage />
</Suspense>

  );
}
