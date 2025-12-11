"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { SignupFormData, FormErrors } from "@/types/auth";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "@/lib/validation";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupFormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailBlur = () => {
    const error = validateEmail(formData.email);
    setErrors((prev) => ({ ...prev, email: error }));
  };

  const handlePasswordBlur = () => {
    const error = validatePassword(formData.password);
    setErrors((prev) => ({ ...prev, password: error }));
  };

  const handleConfirmPasswordBlur = () => {
    const error = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );
    setErrors((prev) => ({ ...prev, confirmPassword: error }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: FormErrors = {};
    newErrors.email = validateEmail(formData.email);
    newErrors.password = validatePassword(formData.password);
    newErrors.confirmPassword = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    const res = await fetch("http://localhost:3001/users/signup", {
      method: "POST",
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      alert(res.statusText);
      setIsSubmitting(false);
      return null;
    }
    const response = await res.json();
    console.log(response);

    // Redirect to email confirmation page
    router.push("/email-confirmation");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800 p-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Sign Up
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Create your account to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, email: value }))
              }
              onBlur={handleEmailBlur}
              error={errors.email}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />

            <div>
              <Input
                id="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, password: value }))
                }
                onBlur={handlePasswordBlur}
                error={errors.password}
                placeholder="Create a strong password"
                autoComplete="new-password"
                required
              />
              <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 space-y-1">
                <p className="font-medium">Password must contain:</p>
                <ul className="list-disc list-inside ml-2 space-y-0.5">
                  <li>At least 8 characters</li>
                  <li>One uppercase letter</li>
                  <li>One lowercase letter</li>
                  <li>One number</li>
                  <li>One special character (!@#$%^&*-)</li>
                </ul>
              </div>
            </div>

            <Input
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, confirmPassword: value }))
              }
              onBlur={handleConfirmPasswordBlur}
              error={errors.confirmPassword}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              required
            />

            <Button type="submit" disabled={isSubmitting} fullWidth>
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
