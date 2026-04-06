import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        couture: {
          gold: "#B8972E",
          "gold-light": "#C9A96E",
          "gold-dark": "#8B6914",
          ivory: "#FAF8F3",
          charcoal: "#2C2C2C",
          "charcoal-light": "#4A4A4A",
          cream: "#F5F0E8",
          white: "#FFFFFF",
        },
        bodyshop: {
          blush: "#E8A0A0",
          "blush-light": "#F2C4C4",
          "blush-dark": "#C97A7A",
          salmon: "#D4756B",
          "salmon-light": "#E8A090",
          "pink-circle": "#E91E8C",
          "warm-white": "#FDFAF9",
          charcoal: "#2C2C2C",
        },
        shared: {
          "grey-light": "#F5F5F5",
          "grey-mid": "#CCCCCC",
          "grey-text": "#888888",
          "grey-dark": "#555555",
          success: "#4CAF50",
          warning: "#FF9800",
          error: "#F44336",
          gold: "#B8972E",
        },
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Inter", "Helvetica Neue", "sans-serif"],
        display: ["Playfair Display", "Georgia", "serif"],
        script: ["Great Vibes", "cursive"],
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "3.75rem",
        "7xl": "4.5rem",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
        "34": "8.5rem",
        "38": "9.5rem",
      },
      borderRadius: {
        card: "0.5rem",
        pill: "9999px",
        modal: "0.75rem",
      },
      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,0.08)",
        "card-hover": "0 8px 24px rgba(0,0,0,0.14)",
        modal: "0 20px 60px rgba(0,0,0,0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
