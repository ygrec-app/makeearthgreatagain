import { getCollection } from "astro:content";

export type CategorySlug = "unite" | "protect" | "restore" | "feed" | "shift";
export type Lang = "en" | "fr";

export interface ProjectView {
  slug: string;
  title: string;
  tagline: string;
  body: string;
  category: CategorySlug;
  order: number;
}

export interface CategoryView {
  slug: CategorySlug;
  name: string;
  order: number;
  projects: ProjectView[];
}

const pickLang = <T extends Record<string, any>>(
  data: T,
  key: string,
  lang: Lang,
): string => data[`${key}_${lang}`] ?? data[`${key}_en`];

export async function loadCategoriesWithProjects(
  lang: Lang = "en",
): Promise<CategoryView[]> {
  const [projectsRaw, categoriesRaw] = await Promise.all([
    getCollection("projects"),
    getCollection("categories"),
  ]);

  const projects: ProjectView[] = projectsRaw
    .map((p) => ({
      slug: p.data.slug,
      title: pickLang(p.data, "title", lang),
      tagline: pickLang(p.data, "tagline", lang),
      body: pickLang(p.data, "body", lang),
      category: p.data.category,
      order: p.data.order,
    }))
    .sort((a, b) => a.order - b.order);

  return categoriesRaw
    .map((c) => ({
      slug: c.data.slug,
      name: pickLang(c.data, "name", lang),
      order: c.data.order,
      projects: projects.filter((p) => p.category === c.data.slug),
    }))
    .sort((a, b) => a.order - b.order);
}
