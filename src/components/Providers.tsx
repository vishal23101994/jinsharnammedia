"use client";

import { SessionProvider } from "next-auth/react";
import { AudioPlayerProvider } from "@/app/providers/AudioPlayerProvider";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AudioPlayerProvider>
        {children}
      </AudioPlayerProvider>
    </SessionProvider>
  );
}
