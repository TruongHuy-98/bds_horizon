import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

// Nitro is required for TanStack Start on Vercel.
export default defineConfig({
  tanstackStart: {
    target: "vercel",
  },
  vite: {
    plugins: [nitro()],
  },
});
