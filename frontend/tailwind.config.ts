import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5C6AC4',
        secondary: '#9C6ADE',
        background: '#F9FAFB',
        card: '#FFFFFF',
        'text-primary': '#1F2937',
        'text-secondary': '#6B7280',
        success: '#10B981',
        error: '#EF4444',
        'swipe-right': '#22C55E',
        'swipe-left': '#F43F5E'
      }
    },
  },
  plugins: [],
}

export default config