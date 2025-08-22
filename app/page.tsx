import HomePage from "@/components/Home/HomePage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-4 text-muted-foreground">Loading...</div>}>
      <HomePage />
    </Suspense>
  );
}
