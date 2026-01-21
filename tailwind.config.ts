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
        background: "#f5f5f7",
        primary: "#1d1d1f",
        secondary: "#6e6e73",
        tertiary: "#86868b",
      },
    },
  },
  plugins: [],
};
export default config;

