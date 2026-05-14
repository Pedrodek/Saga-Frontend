
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      'lucide-react': 'lucide-react',
      'class-variance-authority': 'class-variance-authority',
      '@radix-ui/react-tooltip': '@radix-ui/react-tooltip',
      '@radix-ui/react-slot': '@radix-ui/react-slot',
      '@radix-ui/react-separator': '@radix-ui/react-separator',
      '@radix-ui/react-label': '@radix-ui/react-label',
      '@radix-ui/react-dialog': '@radix-ui/react-dialog',
      '@radix-ui/react-checkbox': '@radix-ui/react-checkbox',
      '@radix-ui/react-avatar': '@radix-ui/react-avatar',
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'build',
  },
  server: {
    port: 5173,
    open: true,
  },
});