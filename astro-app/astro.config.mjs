import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  // Netlify expects a static build output in `dist/` (no adapter)
  output: "static",
  site: process.env.SITE_URL,
});
