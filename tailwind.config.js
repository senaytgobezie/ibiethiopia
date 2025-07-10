/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#f0a500", // Brighter gold accent color for better visibility
      },
      fontFamily: {
        cormorant: ["var(--font-Cormorant)", "serif"],
      },
    },
  },
  plugins: [],
};
