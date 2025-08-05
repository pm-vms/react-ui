import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "src/shared"), // optional, if needed
    },
  },
  optimizeDeps: {
    exclude: ["lucide-react"], // only if you're having specific issues with it
  },
  build: {
    outDir: "dist", // can change to "dist/spa" if you prefer
  },
  server: {
    port: 5173, // default Vite port; change if needed
    host: "localhost",
  },
});
