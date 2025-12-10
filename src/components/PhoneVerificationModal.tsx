"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Props {
  phone: string;
  onClose: () => void;
  onVerified: () => void;
}

export default function PhoneVerificationModal({ phone, onClose, onVerified }: Props) {
  const [step, setStep] = useState<"send" | "verify" | "success">("send");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);

  // Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const id = setTimeout(() => setTimer((t) => t - 1), 1000);
      return () => clearTimeout(id);
    }
  }, [timer]);

  const otp = otpDigits.join("");

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);

    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  // ✅ Send OTP
  const sendOtp = async () => {
    setMsg(null);
    if (!phone) return setMsg("Please enter your phone number first.");
    setLoading(true);
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      setStep("verify");
      setMsg("OTP sent successfully. Please check your phone.");
      setTimer(60); // 60 seconds resend timer
    } catch (err: any) {
      setMsg(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP
  const verifyOtp = async () => {
    setMsg(null);
    if (otp.length !== 6) return setMsg("Please enter all 6 digits.");
    setLoading(true);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid OTP");

      setStep("success");
      setMsg("Phone verified successfully!");
      setTimeout(() => {
        onVerified();
        onClose();
      }, 2000);
    } catch (err: any) {
      setMsg(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md rounded-2xl bg-white text-gray-800 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-lg">
            {step === "success" ? "Verified 🎉" : "Phone Verification"}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center space-y-5">
          {step === "send" && (
            <>
              <p className="text-gray-600 text-sm mb-4">
                We’ll send a 6-digit code to <strong>{phone}</strong>
              </p>
              <button
                onClick={sendOtp}
                disabled={loading}
                className="w-full py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </>
          )}

          {step === "verify" && (
            <>
              <p className="text-gray-600 text-sm mb-3">
                Enter the OTP sent to <strong>{phone}</strong>
              </p>

              {/* OTP boxes */}
              <div className="flex justify-center gap-2 mb-3">
                {otpDigits.map((d, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleChange(i, e.target.value)}
                    className="w-10 h-10 text-center border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-amber-400"
                  />
                ))}
              </div>

              <button
                onClick={verifyOtp}
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                onClick={sendOtp}
                disabled={timer > 0}
                className="text-sm text-amber-700 mt-2 disabled:text-gray-400"
              >
                {timer > 0 ? `Resend OTP in ${timer}s` : "Didn’t get it? Resend"}
              </button>
            </>
          )}

          {step === "success" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="flex flex-col items-center justify-center space-y-3"
            >
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white text-3xl">
                ✓
              </div>
              <p className="text-green-700 font-semibold">Verified Successfully!</p>
            </motion.div>
          )}

          {msg && (
            <p
              className={`text-sm ${
                step === "success" ? "text-green-700" : "text-amber-700"
              }`}
            >
              {msg}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
