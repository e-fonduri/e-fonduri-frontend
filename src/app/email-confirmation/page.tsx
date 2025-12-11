"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function EmailConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!token) {
      // Start countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push("/login");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [token, router]);

  if (token) {
    // Handle token verification here if needed
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800 p-4">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Verifying Email...
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Please wait while we verify your email address.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800 p-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Check Your Email
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              We've sent you a confirmation email. Please check your inbox and
              click the confirmation link to activate your account.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              Redirecting to login in{" "}
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {countdown}
              </span>{" "}
              seconds...
            </p>
          </div>

          <div className="space-y-2">
            <Link
              href="/login"
              className="inline-block text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Click here if you're not being redirected
            </Link>
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              Didn't receive an email? Check your spam folder or contact
              support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
