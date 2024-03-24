import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { jsxRoutes } from "remix-json-routes";
import routes from "./src/routes";

export default defineConfig({
  plugins: [
    remix({
      appDirectory: "src",
      routes: async (defineRoutes) => jsxRoutes(defineRoutes, routes),
    }), 
    tsconfigPaths({ ignoreConfigErrors: true }),
  ],
});
