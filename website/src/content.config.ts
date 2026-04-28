import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    slug: z.string(),
    title_en: z.string(),
    title_fr: z.string(),
    tagline_en: z.string(),
    tagline_fr: z.string(),
    body_en: z.string(),
    body_fr: z.string(),
    category: z.enum(["unite", "protect", "restore", "feed", "shift"]),
    order: z.number().int(),
  }),
});

const categories = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/categories" }),
  schema: z.object({
    slug: z.enum(["unite", "protect", "restore", "feed", "shift"]),
    name_en: z.string(),
    name_fr: z.string(),
    order: z.number().int(),
  }),
});

export const collections = { projects, categories };
