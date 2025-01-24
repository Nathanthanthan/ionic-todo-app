/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "muted": "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        "border": "var(--border)",
      },
    },
  },
  plugins: [],
}
