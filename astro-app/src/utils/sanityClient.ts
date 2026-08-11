import { createClient } from "@sanity/client";

const projectId =
  import.meta.env.PUBLIC_SANITY_STUDIO_PROJECT_ID ||
  import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset =
  import.meta.env.PUBLIC_SANITY_STUDIO_DATASET ||
  import.meta.env.PUBLIC_SANITY_DATASET ||
  "production";

if (!projectId) {
  throw new Error(
    "Missing PUBLIC_SANITY_STUDIO_PROJECT_ID or PUBLIC_SANITY_PROJECT_ID"
  );
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-12-08",
  useCdn: true,
});
