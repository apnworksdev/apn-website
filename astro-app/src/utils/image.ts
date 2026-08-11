import imageUrlBuilder from "@sanity/image-url";
import type { Image, ImageAsset } from "@sanity/types";
import { sanityClient } from "./sanityClient";

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: Image | ImageAsset) {
  return builder.image(source).quality(88).auto("format");
}

const DEFAULT_SRCSET_WIDTHS = [400, 800, 1200, 1600, 2000, 2400, 3200];

export function buildSrcSet(
  source: Image | ImageAsset,
  widths: number[] = DEFAULT_SRCSET_WIDTHS
) {
  const imageUrl = urlFor(source);
  return widths
    .map((w) => `${imageUrl.width(w).url()} ${w}w`)
    .join(", ");
}
