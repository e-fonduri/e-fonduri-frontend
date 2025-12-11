"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EmailUnverifiedPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Poll for email verification status every 3 seconds
    const interval = setInterval(async () => {
      setIsChecking(true);
      console.log("🔍 Checking email verification status...");
      await update(); // Triggers the JWT callback with trigger: "update"
      setIsChecking(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [update]);

  // Redirect to dashboard if email is verified
  useEffect(() => {
    if (session?.user?.accountStatus === "verified") {
      console.log("✅ Email verified! Redirecting to dashboard...");
      router.push("/dashboard");
    }
  }, [session?.user?.accountStatus, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800 p-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Your Email is Unverified
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Please check your email and verify your account to continue.
            </p>
          </div>

          {/* Show current status in development */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-3 bg-zinc-100 dark:bg-zinc-800 rounded text-xs text-zinc-600 dark:text-zinc-400">
              Status: {session?.user?.accountStatus || "loading..."}
              {isChecking && <span className="ml-2 animate-pulse">🔍 Checking...</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
