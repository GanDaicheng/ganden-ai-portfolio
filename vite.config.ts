import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/ganden-ai-portfolio/",
  plugins: [react()],
});
