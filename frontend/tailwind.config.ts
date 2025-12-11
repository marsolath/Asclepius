import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm medical care palette
        primary: {
          50: "#fdf8f6",
          100: "#f9ebe5",
          200: "#f5d5c8",
          300: "#e8b4a0",
          400: "#d88c6c",
          500: "#c96b47",
          600: "#b85636",
          700: "#9a452c",
          800: "#7d3a28",
          900: "#663325",
        },
        warmGray: {
          50: "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
        },
        healing: {
          light: "#e8f5e9",
          DEFAULT: "#4caf50",
          dark: "#2e7d32",
        },
        caution: {
          light: "#fff8e1",
          DEFAULT: "#ffc107",
          dark: "#f57f17",
        },
        alert: {
          light: "#ffebee",
          DEFAULT: "#f44336",
          dark: "#c62828",
        },
      },
      fontFamily: {
        sans: ["Outfit", "system-ui", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(201, 107, 71, 0.5)" },
          "100%": { boxShadow: "0 0 20px rgba(201, 107, 71, 0.8)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

