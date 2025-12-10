// app/auth/reset-password/page.tsx
import { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
          <p>Loading reset form...</p>
        </div>
      }
    >
      <ResetPasswordClient />
    </Suspense>
  );
}
