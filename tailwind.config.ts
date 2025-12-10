import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spiritual: {
          light: "#FAF5E9", // creamy background
          warm: "#CFAF72",  // golden accent
          saffron: "#EBA937", // saffron tone
          brown: "#5A4A3B",
          dark: "#2E2A24",
        },
      },
      fontFamily: {
        serif: ["'Playfair Display'", "serif"],
        sans: ["'Poppins'", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
