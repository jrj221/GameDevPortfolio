import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Allow importing shared DTOs from ../shared (outside the frontend project root).
  server: {
    fs: {
      allow: ['..'],
    },
  },
})
