import type { PortableTextBlock } from "@portabletext/types";
import type { ImageAsset, Slug } from "@sanity/types";
import groq from "groq";
import { sanityClient } from "./sanityClient";

const mediaProjection = `{
  _type,
  _key,
  _type == "image" => {
    alt,
    asset,
    crop,
    hotspot,
    "dimensions": asset->metadata.dimensions
  },
  _type == "file" => {
    "asset": asset->{
      _id,
      url,
      originalFilename,
      mimeType,
      size
    },
    poster{
      "asset": asset->,
      alt
    }
  }
}`;

export async function getProjectSlugs(): Promise<string[]> {
  const slugs = await sanityClient.fetch<Array<string | null>>(
    groq`*[_type == "project" && defined(slug.current)].slug.current`
  );
  return slugs.filter((s): s is string => Boolean(s));
}

const caseStudyModulesProjection = `modules[]{
  _key,
  _type,
  _type == "caseStudyContentBlock" => {
    items[]{
      _key,
      _type,
      _type == "caseStudyText" => {
        text
      },
      _type == "caseStudyMedia" => {
        fit,
        caption,
        media[]${mediaProjection}
      },
      _type == "caseStudyTextMedia" => {
        mediaPosition,
        text,
        media[]${mediaProjection}
      },
      _type == "caseStudyMediaGrid" => {
        columns,
        media[]${mediaProjection}
      }
    }
  },
  _type == "caseStudySeparator" => {
    media[]${mediaProjection}
  }
}`;

export async function getProject(slug: string): Promise<Project | null> {
  return await sanityClient.fetch(
    groq`*[_type == "project" && slug.current == $slug][0]{
      _id,
      title,
      layout,
      slug,
      thumbnail,
      excerpt,
      description,
      year,
      client,
      location,
      typeface,
      animationBy,
      techStack,
      services,
      customCredits[]{
        credit,
        text
      },
      links,
      status,
      designedBy,
      "media": coalesce(regularMedia, extendedMedia)[]${mediaProjection},
      ${caseStudyModulesProjection}
    }`,
    { slug }
  );
}

export async function getFeaturedCarousel(): Promise<FeaturedCarousel | null> {
  return await sanityClient.fetch(
    groq`*[_type == "featuredCarousel"][0]{
      _id,
      modules[]{
        _key,
        project->{
          _id,
          title,
          slug
        },
        label,
        media[]{
          _type,
          _key,
          _type == "image" => {
            asset,
            alt,
            "dimensions": asset->metadata.dimensions
          },
          _type == "file" => {
            asset->{
              _id,
              url,
              originalFilename,
              mimeType,
              size
            },
            poster{
              asset->,
              alt
            }
          }
        },
        rotation
      }
    }`
  );
}

export async function getHomepage(): Promise<Homepage | null> {
  return await sanityClient.fetch(
    groq`*[_type == "homepage"][0]{
      _id,
      credits,
      stamps[]{
        _key,
        image,
        top,
        side,
        sideOffset
      },
      modules[]{
        _type,
        _key,
        menuLink,
        ...,
        _type == "hero" => {
          image,
          text,
          disclaimer
        },
        _type == "tableOfWorks" => {
          projects[]->{
            _id,
            title,
            slug,
            thumbnail,
            excerpt,
            description,
            year,
            client,
            location,
            status
          }
        },
        _type == "textModule" => {
          text[]{
            content
          },
          alignment
        },
        _type == "contactModule" => {
          contacts[]{
            title,
            url,
            text
          }
        },
        _type == "dataBox" => {
          items[]{
            title,
            text,
            columns
          }
        },
        _type == "featuredProject" => {
          project->{
            _id,
            title,
            slug,
            thumbnail,
            description,
            designedBy
          },
          label,
          showDesignedBy,
          text,
          media[]{
            _type,
            _key,
            _type == "image" => {
              asset->,
              alt
            },
            _type == "file" => {
              asset->{
                _id,
                url,
                originalFilename,
                mimeType,
                size
              },
              poster{
                asset->,
                alt
              }
            }
          }
        }
      }
    }`
  );
}

export interface Homepage {
  _id: string;
  modules?: HomepageModule[];
  credits?: PortableTextBlock[];
  stamps?: HomepageStamp[];
}

export interface HomepageStamp {
  _key: string;
  image?: ImageAsset & { alt?: string };
  top?: number;
  side?: "left" | "right";
  sideOffset?: number;
}

export type HomepageModule =
  | HeroModule
  | TableOfWorksModule
  | TextModule
  | ContactModule
  | DataBoxModule
  | FeaturedProjectModule;

export interface HeroModule {
  _type: "hero";
  _key: string;
  menuLink?: string;
  image?: ImageAsset & { alt?: string };
  text?: PortableTextBlock[];
  disclaimer?: PortableTextBlock[];
}

export interface TableOfWorksModule {
  _type: "tableOfWorks";
  _key: string;
  menuLink?: string;
  projects?: Project[];
}

export interface TextBlock {
  _type: "textBlock";
  _key: string;
  content?: PortableTextBlock[];
}

export interface TextModule {
  _type: "textModule";
  _key: string;
  menuLink?: string;
  text?: TextBlock[];
  columns?: number;
  alignment?: "justify" | "center";
}

export interface ContactModule {
  _type: "contactModule";
  _key: string;
  menuLink?: string;
  contacts?: Contact[];
}

export interface Contact {
  title?: string;
  url?: string;
  text?: string;
}

export interface DataBoxModule {
  _type: "dataBox";
  _key: string;
  menuLink?: string;
  items?: DataBoxItem[];
}

export interface DataBoxItem {
  title?: string;
  text?: PortableTextBlock[];
  columns?: number;
}

export interface FeaturedProjectModule {
  _type: "featuredProject";
  _key: string;
  menuLink?: string;
  label?: string;
  showDesignedBy?: boolean;
  project?: Project;
  text?: PortableTextBlock[];
  media?: MediaItem[];
}

export interface CustomCredit {
  credit?: string;
  text?: PortableTextBlock[];
}

export type CaseStudyMediaFit = "inner" | "outer";

export interface CaseStudyTextItem {
  _key: string;
  _type: "caseStudyText";
  text?: PortableTextBlock[];
}

export interface CaseStudyMediaItem {
  _key: string;
  _type: "caseStudyMedia";
  fit?: CaseStudyMediaFit;
  caption?: string;
  media?: MediaItem[];
}

export interface CaseStudyTextMediaItem {
  _key: string;
  _type: "caseStudyTextMedia";
  mediaPosition?: "left" | "right";
  text?: PortableTextBlock[];
  media?: MediaItem[];
}

export interface CaseStudyMediaGridItem {
  _key: string;
  _type: "caseStudyMediaGrid";
  columns?: 2 | 3 | 4;
  media?: MediaItem[];
}

export type CaseStudyBlockItem =
  | CaseStudyTextItem
  | CaseStudyMediaItem
  | CaseStudyTextMediaItem
  | CaseStudyMediaGridItem;

export interface CaseStudyContentBlock {
  _key: string;
  _type: "caseStudyContentBlock";
  items?: CaseStudyBlockItem[];
}

export interface CaseStudySeparator {
  _key: string;
  _type: "caseStudySeparator";
  media?: MediaItem[];
}

export type CaseStudyModule = CaseStudyContentBlock | CaseStudySeparator;

export interface Project {
  _id: string;
  title?: string;
  layout?: "standard" | "caseStudy";
  slug?: Slug;
  thumbnail?: MediaItem[];
  excerpt?: string;
  description?: string;
  year?: number;
  client?: string;
  location?: string;
  typeface?: string;
  animationBy?: string;
  status?: string;
  designedBy?: string;
  services?: string;
  techStack?: string;
  customCredits?: CustomCredit[];
  links?: PortableTextBlock[];
  media?: MediaItem[];
  modules?: CaseStudyModule[];
}

export interface FileAsset {
  _id: string;
  url: string;
  originalFilename?: string;
  mimeType?: string;
  size?: number;
}

export interface MediaItem {
  _type: "image" | "file";
  _key?: string;
  asset?: ImageAsset | FileAsset;
  alt?: string;
  dimensions?: {
    width?: number;
    height?: number;
  };
  poster?: {
    asset: ImageAsset;
    alt?: string;
  };
}

export interface FeaturedCarousel {
  _id: string;
  modules?: FeaturedCarouselModule[];
}

export interface FeaturedCarouselModule {
  _key: string;
  project?: Pick<Project, "_id" | "title" | "slug">;
  label?: PortableTextBlock[];
  media?: MediaItem[];
  rotation?: string;
}
