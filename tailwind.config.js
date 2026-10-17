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
          DEFAULT: "#f2f3f5",
          card: "#ffffff",
          hover: "#f7f7f9",
          muted: "#eceef1",
          dark: "#17181c",
        },
        border: {
          DEFAULT: "#e3e5e8",
          light: "#d0d4da",
        },
        txt: {
          DEFAULT: "#1f2329",
          secondary: "#4b5260",
          muted: "#8a909b",
        },
        accent: {
          DEFAULT: "#f05a28",
          hover: "#d94815",
          soft: "#fff1eb",
        },
        link: {
          DEFAULT: "#2563eb",
        },
        status: {
          ongoing: "#16a34a",
          completed: "#2563eb",
          hiatus: "#d97706",
          cancelled: "#dc2626",
        },
      },
      fontFamily: {
        sans: ["Be Vietnam Pro", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};
module.exports = config;
