import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0b0f14",
        panel: "#111822",
        mint: "#74f7c7",
        coral: "#ff8f70",
        honey: "#ffd166",
        lilac: "#b8a7ff",
      },
      boxShadow: {
        glow: "0 0 40px rgba(116, 247, 199, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
