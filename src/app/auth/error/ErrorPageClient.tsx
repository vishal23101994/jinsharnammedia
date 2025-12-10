"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ErrorPageClient() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    OAuthSignin: "There was a problem signing in with the provider.",
    OAuthCallback: "Something went wrong during sign-in.",
    CredentialsSignin: "Invalid email or password.",
    SessionRequired: "Please sign in to access this page.",
    Default: "An unexpected error occurred. Please try again later.",
  };

  const message = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full">
        <h1 className="text-2xl font-semibold text-red-600 mb-3">
          Authentication Error
        </h1>
        <p className="text-gray-700 mb-6">{message}</p>
        <Link
          href="/auth/login"
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
