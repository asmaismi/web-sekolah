/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1", // primary
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        }
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 6px 24px -6px rgba(2,6,23,.08)",
        soft: "0 1px 2px rgba(2,6,23,.06)",
      },
      container: {
        center: true,
        padding: "1rem",
        screens: { lg: "1024px", xl: "1160px", "2xl": "1280px" },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
