import netlify from "@astrojs/netlify";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  // Render pages on each request so published Sanity content
  // shows up without a new Netlify deploy.
  output: "server",
  adapter: netlify({
    imageCDN: false,
  }),
  site: process.env.SITE_URL,
});
