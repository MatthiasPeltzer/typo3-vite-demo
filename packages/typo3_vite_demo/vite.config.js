import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue(),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // The full origin that will be used when generating HMR and asset URLs
    origin: 'https://typo3-vite-demo.ddev.site:5173',
    // Allow requests from the DDEV domain
    cors: true,
    // HMR must use WSS and the DDEV hostname when TYPO3 is served via HTTPS
    hmr: {
      protocol: 'wss',
      host: 'typo3-vite-demo.ddev.site',
      port: 5173,
    },
  },
  publicDir: false, // disable copy `public/` to outDir
  build: {
    rollupOptions: {
      input: {
        main: 'Resources/Private/JavaScript/main.js', // Frontend entry point
        ckeditor: 'Resources/Private/Scss/ckeditor.scss', // ckeditor styles entry point
      },
      output: {
        assetFileNames: (assetInfo) => {
          // Output ckeditor.css without hash for easy TYPO3 backend registration
          if (assetInfo.name === 'ckeditor.css') {
            return 'ckeditor.css';
          }
          // Keep hashed filenames for other assets
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    manifest: 'manifest.json', // generate manifest.json in outDir root (not in .vite/)
    outDir: 'Resources/Public/Vite/', // `pnpm build` purges outDir
  },
  css: {
    devSourcemap: true, // disabled by default because of performance reasons
  }
})

