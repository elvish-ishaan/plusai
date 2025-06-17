import HomePage from "@/components/Home/HomePage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-4 text-gray-500">Loading...</div>}>
      <HomePage />
    </Suspense>
  );
}
