"use client";
import { ArrowLeft, Sparkles } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      setLoading(true)
      await signIn("google", { callbackUrl: "/" });
      setLoading(false);
    } catch (err) {
      console.log(err, "err in signing with google");
      setError("Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-8 bg-background dark:bg-background  ">
      {/* Background Gradient & Noise */}

      {/* Back Button */}
      <div className="absolute left-4 top-4">
        <button
          onClick={() => router.push("/")}
          className="flex items-center cursor-pointer h-9 px-4 py-2 gap-2 rounded-md text-sm font-medium text-foreground hover:bg-accent transition-colors dark:text-foreground dark:bg-accent dark:hover:bg-accent/80"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Chat
        </button>
      </div>

      {/* Main Content */}
      <h1 className="mb-5 text-xl font-bold text-foreground dark:text-foreground flex items-center gap-2">
        Welcome to
        <Sparkles className=" text-primary size-10"/>
      </h1>

      <div className="mb-8 text-center text-primary dark:text-primary">
        <p>
          Sign in below (we&apos;ll increase your message limits if you do 😉)
        </p>
      </div>

      {/* Google Sign-In Button */}
      <div className="w-full max-w-sm">
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex items-center justify-center gap-3 w-full h-14 px-6 py-2 text-lg font-semibold text-primary-foreground bg-primary hover:bg-primary/80 active:bg-primary dark:bg-primary dark:text-primary-foreground rounded-lg shadow transition-all hover:shadow-lg cursor-pointer backdrop-blur-sm"
        >
          <Image src="/google.png" alt="Google" width={24} height={24} />
          Continue with Google
        </button>
        {error && (
          <p className="mt-4 text-destructive text-sm text-center">{error}</p>
        )}
      </div>

      {/* Terms */}
      <div className="mt-6 text-center text-sm text-primary/80 dark:text-muted-foreground">
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
