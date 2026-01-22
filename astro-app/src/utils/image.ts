import imageUrlBuilder from "@sanity/image-url";
import type { Image, ImageAsset } from "@sanity/types";
import { sanityClient } from "sanity:client";

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: Image | ImageAsset) {
  return builder.image(source);
}
