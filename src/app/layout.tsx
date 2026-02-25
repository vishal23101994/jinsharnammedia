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
import WhatsAppButton from "@/components/WhatsAppButton";
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
          {/* 🔔 GLOBAL TOASTER - Must be high in tree */}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: "14px",
                background: "#6A0000",
                color: "#fff",
                fontWeight: "500",
                padding: "14px 18px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              },
              success: {
                style: {
                  background: "linear-gradient(135deg, #065f46, #10b981)",
                },
                iconTheme: {
                  primary: "#fff",
                  secondary: "#10b981",
                },
              },
              error: {
                style: {
                  background: "linear-gradient(135deg, #7f1d1d, #dc2626)",
                },
                iconTheme: {
                  primary: "#fff",
                  secondary: "#dc2626",
                },
              },
            }}
          />

          <AudioPlayerProvider>
            <Navbar />
            <NewsTicker />
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
        <WhatsAppButton />
      </body>
    </html>
  );
}
