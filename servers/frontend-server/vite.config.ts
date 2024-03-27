import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { generateRemixRoutes } from "./src/routes";

export default defineConfig({
  plugins: [
    remix({
      appDirectory: "src",
      routes: async (defineRoutes) => 
        defineRoutes((route) => {
          generateRemixRoutes(route);
        }),
    }),
    tsconfigPaths({ ignoreConfigErrors: true }),
  ],
});
