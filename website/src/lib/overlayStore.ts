import { writable } from "svelte/store";

export interface OverlayProject {
  slug: string;
  title: string;
  tagline: string;
  body: string;
  category: string;
  categoryName: string;
}

export const overlayProject = writable<OverlayProject | null>(null);

export function openOverlay(p: OverlayProject) {
  overlayProject.set(p);
}

export function closeOverlay() {
  overlayProject.set(null);
}
