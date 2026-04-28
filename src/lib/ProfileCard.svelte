<script lang="ts">
  import { tick } from "svelte";
  import { resolveProfilePictureSlides } from "$lib/profilePictureSources";

  /**
   * Public API: the parent (e.g. +page.svelte) passes props to configure each instance.
   * Runes (Svelte 5):
   * - $props() — inputs from the parent.
   * - $derived(...) — recomputed when what it reads changes (no manual sync).
   * - $state(...) — local mutable UI state (carousel index, loading flags).
   * - $effect(...) — runs after updates for side effects (reset index, preload neighbors).
   */

  let {
    pictureFolder,
    userName,
    shortDescription = "profile description default/watermark text",
  }: {
    pictureFolder?: string;
    userName?: string;
    shortDescription?: string;
  } = $props();

  const resolvedSlides = $derived(resolveProfilePictureSlides(pictureFolder));

  let currentIndex = $state(0);

  // Carousel only: hide the new slide until its <img> has loaded (skeleton + disabled arrows).
  let carouselSlideReady = $state(true);

  let carouselImgEl: HTMLImageElement | undefined = $state();

  $effect(() => {
    void pictureFolder;
    currentIndex = 0;
  });

  // Warm prev/next URLs so arrow taps often hit the browser cache (not a Svelte feature — plain Image()).
  $effect(() => {
    const list = resolvedSlides;
    const i = currentIndex;
    if (list.length < 2) return;

    const n = list.length;
    const warm = (idx: number) => {
      const img = new Image();
      img.decoding = "async";
      img.src = list[idx]!.url;
    };

    warm((i + 1) % n);
    warm((i - 1 + n) % n);
  });

  // On slide change: mark busy, then after DOM flush check img.complete (cached files may not fire load).
  $effect(() => {
    const list = resolvedSlides;
    const i = currentIndex;
    void list;
    void i;

    if (list.length < 2) {
      carouselSlideReady = true;
      return;
    }

    carouselSlideReady = false;
    void tick().then(() => {
      const el = carouselImgEl;
      if (el?.complete && el.naturalWidth > 0) {
        carouselSlideReady = true;
      }
    });
  });

  function onCarouselImgLoad() {
    carouselSlideReady = true;
  }

  function onCarouselImgError() {
    carouselSlideReady = true;
  }

  function showPrev() {
    const n = resolvedSlides.length;
    if (n < 2) return;
    currentIndex = (currentIndex - 1 + n) % n;
  }

  function showNext() {
    const n = resolvedSlides.length;
    if (n < 2) return;
    currentIndex = (currentIndex + 1) % n;
  }

  // Grid column count for the desktop strip (1–3). Same list drives mobile carousel.
  const gridColumns = $derived(Math.min(resolvedSlides.length, 3));
  const showCarouselNav = $derived(resolvedSlides.length > 1);
</script>

<article class="profile-card">
  <div class="media">
    <div
      class="desktop-gallery"
      style="--profile-cols: {gridColumns}"
      aria-label="Profile photos for {userName}"
    >
      {#each resolvedSlides as slide, i (`${i}-${slide.url}`)}
        <!-- First tile: not lazy — start the main desktop image early. Other tiles stay lazy. -->
        <div class="tile-slot">
          <img
            class="tile"
            src={slide.url}
            alt="{slide.caption} — {userName}"
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            fetchpriority={i === 0 ? "high" : "low"}
          />
          <div class="image-caption">{slide.caption}</div>
        </div>
      {/each}
    </div>

    <div
      class="mobile-carousel"
      class:mobile-carousel--busy={showCarouselNav && !carouselSlideReady}
      aria-live="polite"
      aria-busy={showCarouselNav && !carouselSlideReady}
    >
      <div class="carousel-inner">
        {#if showCarouselNav}
          <button
            type="button"
            class="nav nav-prev"
            aria-label="Vorheriges Bild"
            disabled={!carouselSlideReady}
            onclick={showPrev}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                fill="currentColor"
                d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"
              />
            </svg>
          </button>
        {/if}

        <div class="carousel-view">
          <div class="carousel-skeleton" aria-hidden="true"></div>
          <div
            class="carousel-stage"
            class:carousel-stage--hidden={showCarouselNav &&
              !carouselSlideReady}
          >
            <!-- Visible on small screens: eager + high priority so the hero image is not deferred by lazy loading. -->
            <img
              bind:this={carouselImgEl}
              class="carousel-img"
              src={resolvedSlides[currentIndex].url}
              alt="{resolvedSlides[currentIndex].caption} — {userName}"
              loading="eager"
              decoding="async"
              fetchpriority="high"
              onload={onCarouselImgLoad}
              onerror={onCarouselImgError}
            />
            <div class="image-caption">
              {resolvedSlides[currentIndex].caption}
            </div>
          </div>
        </div>

        {#if showCarouselNav}
          <button
            type="button"
            class="nav nav-next"
            aria-label="Nächstes Bild"
            disabled={!carouselSlideReady}
            onclick={showNext}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                fill="currentColor"
                d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"
              />
            </svg>
          </button>
        {/if}
      </div>
    </div>
  </div>

  <h2 class="title">{userName}</h2>
  {#if shortDescription}
    <p class="description">{shortDescription}</p>
  {/if}
</article>

<style>
  .profile-card {
    border: 1px solid color-mix(in srgb, CanvasText 12%, transparent);
    border-radius: 12px;
    overflow: hidden;
    background: Canvas;
    color: CanvasText;
    max-width: 100%;
  }

  .media {
    width: 100%;
  }

  .desktop-gallery {
    display: none;
    width: 100%;
    gap: 0.5rem;
    grid-template-columns: repeat(var(--profile-cols, 1), minmax(0, 1fr));
    padding: 0.5rem;
    box-sizing: border-box;
  }

  .tile-slot {
    position: relative;
    aspect-ratio: 1;
    min-width: 0;
    border-radius: 8px;
    overflow: hidden;
  }

  .tile {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* Filename-based label; dark scrim so text stays readable on busy photos. */
  .image-caption {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    padding: 0.3rem 0.45rem;
    font-size: 0.72rem;
    line-height: 1.25;
    text-align: center;
    color: #fff;
    background: rgba(0, 0, 0, 0.55);
    pointer-events: none;
    word-break: break-word;
  }

  .mobile-carousel {
    display: block;
    padding: 0.5rem;
    box-sizing: border-box;
  }

  .carousel-inner {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    min-height: 0;
  }

  .carousel-view {
    position: relative;
    flex: 1;
    min-width: 0;
    aspect-ratio: 1;
  }

  .carousel-stage {
    position: absolute;
    inset: 0;
    z-index: 0;
    border-radius: 8px;
    overflow: hidden;
  }

  .carousel-stage--hidden .carousel-img,
  .carousel-stage--hidden .image-caption {
    opacity: 0;
  }

  .carousel-img,
  .image-caption {
    transition: opacity 0.12s ease;
  }

  .carousel-skeleton {
    position: absolute;
    inset: 0;
    border-radius: 8px;
    pointer-events: none;
    z-index: 1;
    opacity: 0;
    background: color-mix(in srgb, CanvasText 8%, Canvas);
    transition: opacity 0.15s ease;
  }

  .mobile-carousel--busy .carousel-skeleton {
    opacity: 1;
  }

  @media (prefers-reduced-motion: no-preference) {
    .mobile-carousel--busy .carousel-skeleton {
      animation: profile-card-skeleton 0.9s ease-in-out infinite;
    }
  }

  @keyframes profile-card-skeleton {
    0%,
    100% {
      opacity: 0.45;
    }
    50% {
      opacity: 0.75;
    }
  }

  .carousel-img {
    position: absolute;
    inset: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .nav {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    padding: 0;
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, CanvasText 18%, transparent);
    background: color-mix(in srgb, Canvas 92%, CanvasText 8%);
    color: inherit;
    cursor: pointer;
  }

  .nav:focus-visible {
    outline: 2px solid color-mix(in srgb, CanvasText 55%, transparent);
    outline-offset: 2px;
  }

  .nav:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    .desktop-gallery {
      display: grid;
    }

    .mobile-carousel {
      display: none;
    }
  }

  .title {
    margin: 0;
    padding: 0.5rem 0.75rem 0;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .description {
    margin: 0;
    padding: 0.35rem 0.75rem 0.75rem;
    font-size: 0.9rem;
    line-height: 1.4;
    opacity: 0.9;
  }
</style>
