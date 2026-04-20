<script lang="ts">
  // fly: built-in Svelte transition primitive (svelte/transition, not SvelteKit)
  import { fly } from "svelte/transition";
  import ProfileCard from "$lib/ProfileCard.svelte";

  const profiles = [
    {
      pictureFolder: "ben_banger",
      userName: "Ben Banger",
      shortDescription:
        "Suche Hündin für gemeinsame Pfützensprünge und Sofa-Abende.",
    },
    {
      pictureFolder: "alan_king",
      userName: "Alan King",
      shortDescription:
        "Herrchen sagt ich bin der beste Hund. Herrchen lügt nicht.",
    },
    {
      pictureFolder: "charles_mega",
      userName: "Charles Mega",
      shortDescription:
        "Mag lange Spaziergänge und noch längere Schläfchen danach.",
    },
    {
      userName: "Max Mustermann",
      shortDescription: "Kein Profiltext vorhanden.",
    },
    {
      pictureFolder: "ben_banger",
      userName: "Luna Lauf",
      shortDescription:
        "Sportliche Hündin sucht Laufpartner für den Englischen Garten.",
    },
    {
      pictureFolder: "alan_king",
      userName: "Rocky Road",
      shortDescription:
        "Stehe auf Leckerlis, Kraulen hinterm Ohr und ehrliche Pfoten.",
    },
  ];

  let currentIndex = $state(0);
  let showMatch = $state(false);

  // raw number, no reactivity needed — never triggers a re-render
  let touchStartX = 0;
  const SWIPE_THRESHOLD = 50;

  function onTouchStart(e: TouchEvent) {
    touchStartX = e.touches[0].clientX;
  }

  function onTouchEnd(e: TouchEvent) {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;

    // left swipe = match; direction handling for navigation comes in step 2
    if (delta < 0) {
      showMatch = true;
      setTimeout(() => (showMatch = false), 800);
    }

    currentIndex = (currentIndex + 1) % profiles.length;
  }
</script>

<h1>Dog Tinder</h1>

<div class="deck-wrapper">
  <!-- match badge fades in above the card, flies upward on exit -->
  {#if showMatch}
    <div class="match-badge" transition:fly={{ y: -30, duration: 350 }}>
      MATCH
    </div>
  {/if}

  <div
    class="deck"
    role="region"
    aria-label="Profil-Karten"
    ontouchstart={onTouchStart}
    ontouchend={onTouchEnd}
  >
    <!-- {#key} destroys and recreates the node on every index change, triggering in:fly -->
    {#key currentIndex}
      <div in:fly={{ x: 300, duration: 220 }}>
        <ProfileCard {...profiles[currentIndex]} />
      </div>
    {/key}
  </div>
</div>

<div class="dots" role="tablist" aria-label="Profil-Navigation">
  {#each profiles as _, i}
    <button
      role="tab"
      aria-selected={i === currentIndex}
      aria-label="Profil {i + 1}"
      class="dot"
      class:dot--active={i === currentIndex}
      onclick={() => {
        currentIndex = i;
      }}
    ></button>
  {/each}
</div>

<style>
  h1 {
    text-align: center;
    margin-bottom: 1rem;
  }

  /* wrapper gives the match badge a positioning context above the deck */
  .deck-wrapper {
    position: relative;
    max-width: 380px;
    margin: 0 auto;
  }

  .match-badge {
    position: absolute;
    top: 2rem;
    left: 50%;
    translate: -50% 0;
    z-index: 10;
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: 0.15em;
    color: #2ecc71;
    text-shadow: 0 2px 8px rgba(46, 204, 113, 0.45);
    pointer-events: none;
    white-space: nowrap;
  }

  .deck {
    /* pan-y: browser handles vertical scroll, we capture horizontal touch deltas */
    touch-action: pan-y;
    position: relative;
    overflow: hidden;
  }

  .dots {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    padding: 0;
    background: color-mix(in srgb, CanvasText 20%, transparent);
    transition: background 0.15s ease;
  }

  .dot--active {
    background: CanvasText;
  }
</style>
