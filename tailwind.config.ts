import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ZFP Reality brand colors
        brand: {
          orange: "#CF5400",
          "orange-hover": "#E07E3C",
        },
        zfp: {
          text: "#333333",
          "bg-light": "#F7F7F7",
        },
      },
      fontFamily: {
        heading: ["'Bree Serif'", "Georgia", "serif"],
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
