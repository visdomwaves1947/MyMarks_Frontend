import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // A local .env.development.local can give the dev site its own port (VITE_DEV_PORT), so it runs beside
  // other projects that use 5173; without it nothing changes.
  const env = loadEnv(mode, process.cwd(), '');
  const devPort = Number(env.VITE_DEV_PORT) || 0;

  return {
    plugins: [
      tailwindcss(),
      react(),
    ],
    server: devPort ? { port: devPort, strictPort: true } : {},
  };
});
