/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Microsoft YaHei",
          "sans-serif"
        ]
      },
      colors: {
        pasture: {
          50: "#f2fbf6",
          100: "#dff6e9",
          500: "#18a46d",
          600: "#0f8a5b",
          700: "#0f6f4d",
          900: "#083828"
        },
        cold: {
          500: "#0ea5e9",
          700: "#0369a1"
        }
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 80, 65, 0.12)"
      }
    }
  },
  plugins: []
};
