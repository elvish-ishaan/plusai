import HomePage from "@/components/Home/HomePage";
import MainLoader from "@/components/Loaders/MainLoader";
import { Suspense } from "react";

export default function Page() {
  return (
   <Suspense fallback={<MainLoader/>}>
     <HomePage />
   </Suspense>

  );
}
