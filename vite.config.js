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
         output: [
            {
               format: "umd",
               name: "Handshake",
               dir: "./build",
               entryFileNames: "handshake.umd.cjs",
            },
            {
               format: "es",
               dir: "./build",
               entryFileNames: "handshake.js",
            },
            {
               format: "umd",
               name: "Handshake",
               dir: "./build",
               entryFileNames: "handshake.min.js",
            },
         ],
      },
      sourcemap: true,
   },
});
