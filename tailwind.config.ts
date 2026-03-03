import { type Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Define custom theme extensions here if needed
      // Example:
      // colors: {
      //   'primary': '#1a202c',
      // }
    },
  },
  plugins: [],
} satisfies Config
