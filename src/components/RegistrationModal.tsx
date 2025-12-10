"use client";

import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "jinsharnam_registration_shown";
const AUTH_KEY = "jinsharnam_user_logged_in"; // set this to "true" on successful login

export default function RegistrationModal() {
  const [show, setShow] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const timerRef = useRef<number | null>(null);

  const isUserLoggedIn = () => {
    try {
      return localStorage.getItem(AUTH_KEY) === "true";
    } catch {
      return false;
    }
  };

  // Auto-show once for first-time users (but never if logged in)
  useEffect(() => {
    mountedRef.current = true;

    let alreadyShown = false;
    let loggedIn = false;

    try {
      const shownVal = localStorage.getItem(STORAGE_KEY);
      alreadyShown = shownVal === "true";

      const authVal = localStorage.getItem(AUTH_KEY);
      loggedIn = authVal === "true";
    } catch {
      alreadyShown = false;
      loggedIn = false;
    }

    // If user is logged in, or modal already shown once, do NOT auto-open
    if (!alreadyShown && !loggedIn) {
      timerRef.current = window.setTimeout(() => {
        if (mountedRef.current) {
          setReason(null);
          setShow(true);
        }
      }, 800);
    }

    return () => {
      mountedRef.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Allow opening this modal from anywhere (only if not logged in)
  useEffect(() => {
    const handler = (event: Event) => {
      // If user is logged in, ignore global open requests
      if (isUserLoggedIn()) return;

      const custom = event as CustomEvent<{ reason?: string }>;
      setReason(custom.detail?.reason || null);
      setShow(true);
    };

    window.addEventListener("open-auth-modal", handler);
    return () => window.removeEventListener("open-auth-modal", handler);
  }, []);

  const markAsShown = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore storage error
    }
  };

  const close = () => {
    markAsShown();
    setShow(false);
  };

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && show) {
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999]"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ duration: 0.4, type: "spring" }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-gradient-to-br from-[#4B0000]/95 via-[#360000]/90 to-[#1a0000]/95 rounded-3xl border border-yellow-600/50 shadow-[0_0_40px_-10px_rgba(255,215,0,0.3)] max-w-md w-[90%] md:w-[420px] p-8 text-yellow-100"
          >
            {/* Close button */}
            <button
              onClick={close}
              className="absolute top-3 right-3 bg-yellow-400 text-[#4B0000] p-1.5 rounded-full hover:bg-yellow-300 shadow-md transition-all duration-200"
              aria-label="Close registration modal"
            >
              <X size={18} />
            </button>

            {/* Main heading + default description */}
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-yellow-400 drop-shadow-lg text-center mb-3">
              Welcome to Jinsharnam Media
            </h2>

            <p className="text-sm text-yellow-100/85 text-center leading-relaxed">
              Join our spiritual community to receive the latest{" "}
              <span className="text-yellow-300 font-medium">pravachans</span>,
              updates, and divine insights.
            </p>

            {/* Extra message ONLY when opened from cart/checkout */}
            {reason === "cart" && (
              <p className="mt-3 text-sm text-yellow-200 text-center font-medium">
                For adding a product to cart, please login first.
                <br />
                If you are not a member, please sign up.
              </p>
            )}

            <div className="h-4" />

            {/* Buttons */}
            <div className="space-y-4">
              <Link
                href="/auth/signup"
                onClick={() => close()}
                className="block w-full bg-gradient-to-r from-yellow-400 to-yellow-300 text-[#4B0000] font-semibold py-3 rounded-full text-center shadow-[0_0_15px_-5px_rgba(255,215,0,0.6)] hover:shadow-[0_0_20px_-3px_rgba(255,215,0,0.8)] hover:scale-[1.02] transition-all duration-300"
              >
                Register Now
              </Link>

              <Link
                href="/auth/login"
                onClick={() => close()}
                className="block w-full border border-yellow-400/80 text-yellow-300 font-semibold py-3 rounded-full text-center hover:bg-yellow-500/20 hover:text-yellow-200 hover:scale-[1.02] transition-all duration-300"
              >
                Already a Member? Login
              </Link>
            </div>

            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-yellow-500/20 to-transparent blur-xl -z-10"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
