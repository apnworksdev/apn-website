import { sanityClient } from "sanity:client";
import type { PortableTextBlock } from "@portabletext/types";
import type { ImageAsset, Slug } from "@sanity/types";
import groq from "groq";

export async function getPosts(): Promise<Post[]> {
  return await sanityClient.fetch(
    groq`*[_type == "post" && defined(slug.current)] | order(_createdAt desc)`
  );
}

export async function getPost(slug: string): Promise<Post> {
  return await sanityClient.fetch(
    groq`*[_type == "post" && slug.current == $slug][0]`,
    {
      slug,
    }
  );
}

export async function getHomepage(): Promise<Homepage | null> {
  return await sanityClient.fetch(
    groq`*[_type == "homepage"][0]{
      _id,
      credits,
      modules[]{
        _type,
        _key,
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
            description,
            year,
            client,
            location
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

export interface Post {
  _type: "post";
  _createdAt: string;
  title?: string;
  slug: Slug;
  excerpt?: string;
  mainImage?: ImageAsset & { alt?: string };
  body: PortableTextBlock[];
}

export interface Homepage {
  _id: string;
  modules?: HomepageModule[];
  credits?: PortableTextBlock[];
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
  image?: ImageAsset & { alt?: string };
  text?: PortableTextBlock[];
  disclaimer?: PortableTextBlock[];
}

export interface TableOfWorksModule {
  _type: "tableOfWorks";
  _key: string;
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
  text?: TextBlock[];
  columns?: number;
  alignment?: "justify" | "center";
}

export interface ContactModule {
  _type: "contactModule";
  _key: string;
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
  label?: string;
  showDesignedBy?: boolean;
  project?: Project;
  text?: PortableTextBlock[];
  media?: MediaItem[];
}

export interface Project {
  _id: string;
  title?: string;
  slug?: Slug;
  thumbnail?: MediaItem[];
  description?: string;
  year?: number;
  client?: string;
  location?: string;
  designedBy?: string;
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
  poster?: {
    asset: ImageAsset;
    alt?: string;
  };
}
