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
        // ZFP Design System - Primární barvy
        brand: {
          orange: "#CF5400",
          "orange-hover": "#E07E3C",
          gold: "#C9A961",
          bronze: "#A67C52",
        },
        // Neutrální barvy (Dark Theme)
        zfp: {
          dark: "#1A1A1A",
          darker: "#0A0A0A",
          text: "#F5F5F5",
          "text-muted": "rgba(255,255,255,0.7)",
          "text-subtle": "rgba(255,255,255,0.4)",
          card: "rgba(255,255,255,0.05)",
          border: "rgba(255,255,255,0.1)",
          "border-hover": "rgba(255,255,255,0.2)",
        },
        // Sémantické barvy
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
      },
      fontFamily: {
        // Bree pro nadpisy
        heading: ["Bree", "Georgia", "serif"],
        // Fedra Sans Pro pro tělo textu
        sans: ["Fedra Sans Pro", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        body: ["Fedra Sans Pro", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      maxWidth: {
        'container': '1400px',
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #C9A961, #CF5400)',
        'gradient-dark': 'linear-gradient(180deg, #1A1A1A, #0A0A0A)',
      },
      boxShadow: {
        'card': '0 4px 6px rgba(0,0,0,0.3)',
        'card-hover': '0 10px 15px rgba(0,0,0,0.3)',
        'glow': '0 0 20px rgba(207, 84, 0, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
