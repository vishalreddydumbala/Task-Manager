/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary' : '#F5F5F5',
        'bg-secondary' : '#E5E5E5',
      },
    },
  },
  plugins: [],
}

