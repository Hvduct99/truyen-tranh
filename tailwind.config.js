/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0b0b0f",
          card: "#16161d",
          hover: "#1e1e28",
          elevated: "#1c1c26",
        },
        border: {
          DEFAULT: "#2a2a35",
          light: "#35354a",
        },
        txt: {
          DEFAULT: "#e4e4e7",
          secondary: "#a1a1aa",
          muted: "#71717a",
        },
        accent: {
          DEFAULT: "#3b82f6",
          hover: "#2563eb",
          soft: "rgba(59,130,246,0.1)",
        },
        status: {
          ongoing: "#f59e0b",
          completed: "#22c55e",
          hiatus: "#ef4444",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
module.exports = config;
