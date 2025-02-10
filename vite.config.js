import path from "path";
import { defineConfig } from "vite";
export default defineConfig({
   root: "src",
   build: {
      lib: {
         entry: path.resolve(__dirname, "src/handshake.ts"),
         name: "Handshake",
         fileName: "handshake",
      },
      rollupOptions: {
         output: {
            dir: "./build",
            format: "umd",
            name: "Handshake",
         },
      },
      sourcemap: true,
   },
});
