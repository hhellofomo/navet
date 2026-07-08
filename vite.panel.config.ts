import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';

const packageJson = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as {
  version?: string;
};

export default defineConfig({
  base: '/api/navet/static/',
  cacheDir: '.cache/vite-panel',
  envPrefix: ['VITE_'],
  publicDir: false,
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version ?? '0.0.0'),
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'virtual:pwa-register': path.resolve(
        __dirname,
        './src/test/mocks/virtual-pwa-register.ts'
      ),
    },
  },
  assetsInclude: ['**/*.svg'],
  build: {
    outDir: 'custom_components/navet/frontend',
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/panel/main.tsx'),
      output: {
        entryFileNames: 'navet-panel.js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        manualChunks(id) {
          const moduleId = id.split(path.sep).join('/');

          if (!moduleId.includes('node_modules')) {
            if (moduleId.includes('/src/app/features/energy/')) {
              return 'energy';
            }

            if (moduleId.includes('/src/app/features/settings/')) {
              return 'settings';
            }

            if (moduleId.includes('/src/app/features/dashboard/components/widgets/')) {
              return 'dashboard-widgets';
            }

            return undefined;
          }

          if (
            moduleId.includes('/node_modules/react/') ||
            moduleId.includes('/node_modules/react-dom/') ||
            moduleId.includes('/node_modules/scheduler/')
          ) {
            return 'react-vendor';
          }

          if (moduleId.includes('/node_modules/@radix-ui/')) {
            return 'radix-vendor';
          }

          if (moduleId.includes('/node_modules/lucide-react/')) {
            return 'icons-vendor';
          }

          return 'vendor';
        },
      },
    },
  },
});
