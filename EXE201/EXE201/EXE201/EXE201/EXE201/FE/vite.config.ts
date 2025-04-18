// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   build: {
//     outDir: 'dist'
//   },
//   server: {
//     port: 3000
//   }
// });
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    host: true, // Cho phép truy cập từ mạng
  },
});