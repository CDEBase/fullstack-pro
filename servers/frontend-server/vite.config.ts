import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    remix({
      appDirectory: "src",
      routes: async (defineRoutes) => {
        return defineRoutes((route) => {
          route("/", "exp/index.tsx", () => {
            route("demo", "exp/demo/index.tsx", () => {
              route("counter", "exp/demo/counter.tsx");
            });
          });
        });
      },
    }), 
    tsconfigPaths({ ignoreConfigErrors: true }),
  ],
});
