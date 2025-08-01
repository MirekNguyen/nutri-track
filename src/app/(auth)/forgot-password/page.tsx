"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // This is where you would integrate with Clerk
      // For now, we'll just simulate a password reset request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSubmitted(true);

      toast("Email sent", {
        description:
          "If an account exists with this email, you'll receive a reset link.",
      });
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Error", {
        description: "Failed to send reset email. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-green-600 text-white p-2 rounded">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">NutriTrack</h1>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-green-600 hover:text-green-700 mb-6"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to login
          </Link>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Reset your password
          </h2>
          <p className="text-gray-600 mb-6">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>

          {isSubmitted ? (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
              <h3 className="text-sm font-medium text-green-800">
                Check your email
              </h3>
              <p className="text-sm text-green-700 mt-1">
                We&apos;ve sent a password reset link to {email}. The link will
                expire in 10 minutes.
              </p>
              <Button
                className="w-full mt-4 bg-green-600 hover:bg-green-700"
                onClick={() => setIsSubmitted(false)}
              >
                Send another email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send reset link"
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
}
