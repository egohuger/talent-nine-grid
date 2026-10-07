import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'

// 构建产物是单个 HTML 文件（JS/CSS/图标全部内联），双击即可离线使用；
// 开发模式（npm run dev）不受影响，仍是常规的 Vite dev server。
export default defineConfig({
  base: './',
  plugins: [vue(), viteSingleFile()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
