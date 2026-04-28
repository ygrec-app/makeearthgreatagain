<script lang="ts">
  import { openOverlay } from "../lib/overlayStore";

  interface Props {
    slug: string;
    title: string;
    tagline: string;
    body: string;
    category: string;
    categoryName: string;
    learnMoreLabel?: string;
    openProjectLabel?: string;
  }

  const {
    slug,
    title,
    tagline,
    body,
    category,
    categoryName,
    learnMoreLabel = "LEARN MORE",
    openProjectLabel = "Open project",
  }: Props = $props();

  function open() {
    openOverlay({ slug, title, tagline, body, category, categoryName });
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  }
</script>

<article
  class="project-card"
  data-mode-card
  data-project-slug={slug}
  role="button"
  tabindex="0"
  aria-label={`${openProjectLabel} ${title}`}
  onclick={open}
  onkeydown={onKey}
>
  <div class="card-circle" aria-hidden="true"></div>

  <div class="card-content">
    <h3 class="card-title">{title}</h3>
    <p class="card-tagline">{tagline}</p>
    <span class="card-link">
      {learnMoreLabel}
      <span class="arrow" aria-hidden="true">→</span>
    </span>
  </div>

  <div class="card-clip" aria-hidden="true">
    <h3 class="card-title">{title}</h3>
    <p class="card-tagline">{tagline}</p>
    <span class="card-link">
      {learnMoreLabel}
      <span class="arrow" aria-hidden="true">→</span>
    </span>
  </div>
</article>
