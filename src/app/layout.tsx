import "./globals.css";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Providers from "@/components/Providers";
import { Poppins, Playfair_Display } from "next/font/google";
import BackToTop from "@/components/BackToTop";
import NewsTicker from "@/components/NewsTicker";
import { Toaster } from "react-hot-toast";
import SocialSidebar from "@/components/SocialSidebar";
import RegistrationModal from "@/components/RegistrationModal";

import { AudioPlayerProvider } from "@/app/providers/AudioPlayerProvider";
import GlobalAudioPlayer from "@/components/GlobalAudioPlayer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata = {
  title: "Jinsharnam Media - A Jain Spiritual Platform",
  description: "Spreading the message of peace, truth, and compassion.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} bg-spiritual-light text-spiritual-dark`}
      >
        {/* 🌍 GLOBAL APP PROVIDERS */}
        <Providers>
          {/* 🎧 GLOBAL AUDIO PROVIDER */}
          <AudioPlayerProvider>
            <Navbar />
            <NewsTicker />
            <Toaster />
            <RegistrationModal />

            <main className="min-h-screen">
              {children}
            </main>

            <Footer />

            {/* 🎶 GLOBAL AUDIO POPUP — THIS WAS MISSING */}
            <GlobalAudioPlayer />
          </AudioPlayerProvider>
        </Providers>

        {/* Floating UI */}
        <BackToTop />
        <SocialSidebar />
      </body>
    </html>
  );
}
