import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
// import codegen from 'vite-plugin-codegen';
// import babel from 'vite-plugin-babel';
import { generateRemixRoutes } from "./src/routes";

export default defineConfig({
  // assetsInclude: ['**/*.codegen'],
  plugins: [
    // babel(),
    // (codegen as any).default(),
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
