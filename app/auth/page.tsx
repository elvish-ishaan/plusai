"use client";
import { ArrowLeft } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-8 bg-[#f2e2f5]">
      {/* Background Gradient & Noise */}

      {/* Back Button */}
      <div className="absolute left-4 top-4">
        <button
          onClick={() => router.push("/")}
          className="flex items-center h-9 px-4 py-2 gap-2 rounded-md text-sm font-medium text-[#501854] hover:bg-[#f0cee5] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Chat
        </button>
      </div>

      {/* Main Content */}
      <h1 className="mb-5 text-xl font-bold text-[#501854] flex items-center gap-2">
        Welcome to
        <Image
          src="/logo.png"
          alt="T3.chat Logo"
          width={96}
          height={20}
          className="-mt-1"
        />
      </h1>

      <div className="mb-8 text-center text-[#a74576]">
        <p>Sign in below (we&apos;ll increase your message limits if you do 😉)</p>
      </div>

      {/* Google Sign-In Button */}
      <div className="w-full max-w-sm">
        <button 
          onClick={() => signIn("google", { callbackUrl: "/", redirect: false })}
          className="flex items-center justify-center gap-3 w-full h-14 px-6 py-2 text-lg font-semibold text-white bg-[#a23b67] hover:bg-[#d56698] active:bg-[#a23b67] rounded-lg shadow transition-all hover:shadow-lg backdrop-blur-sm">
          <Image src="/google.png" alt="Google" width={24} height={24} />
          Continue with Google
        </button>
      </div>

      {/* Terms */}
      <div className="mt-6 text-center text-sm text-[#a74576]/80">
        <p>
          By continuing, you agree to our{" "}
          <a href="/terms-of-service" className="hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
