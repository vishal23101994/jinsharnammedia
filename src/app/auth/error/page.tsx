export const dynamic = "force-dynamic";

import { Suspense } from "react";
import ErrorPageClient from "./ErrorPageClient";

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading error info...</div>}>
      <ErrorPageClient />
    </Suspense>
  );
}
