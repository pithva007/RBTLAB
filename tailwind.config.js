/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        rbt: {
          dark: '#0a0d14',
          card: '#111522',
          cardHover: '#161c2d',
          border: '#1e2638',
          red: '#ef4444',
          redGlow: '#f87171',
          black: '#1f2937',
          blackGlow: '#374151',
          nil: '#0d1117',
          accent: '#3b82f6',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace', 'ui-monospace'],
      }
    },
  },
  plugins: [],
}
