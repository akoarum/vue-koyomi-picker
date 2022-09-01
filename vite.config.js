import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    emptyOutDir: false,
    lib: {
      formats: ['es', 'umd'],
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'VueKoyomiPicker',
      filename: 'vue-koyomi-picker',
    },
    rollupOptions: {
      external: ['vue', 'date-fns'],
      output: {
        globals: {
          vue: 'Vue',
          'date-fns': 'dateFns',
        },
      },
    },
  },
})
