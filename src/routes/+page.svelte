<script lang="ts">
  import ProfileCard from "$lib/ProfileCard.svelte";
</script>

<h1 class="page-title">Dog Tinder</h1>

<div class="demo-grid">
  <ProfileCard
    pictureFolder="ben_banger"
    userName="Ben Banger"
    shortDescription="Drei Bilder im Ordner — Desktop: nebeneinander, Mobil: Karussell."
  />

  <ProfileCard
    pictureFolder="alan_king"
    userName="Alan King"
    shortDescription="Mehrere Dateien im Ordner — es werden höchstens drei angezeigt."
  />

  <ProfileCard
    pictureFolder="charles_mega"
    userName="Charles Mega"
    shortDescription="Erste drei Bilder aus dem Ordner charles_mega."
  />

  <ProfileCard
    userName="Max Mustermann"
    shortDescription="Kein pictureFolder — Fallback-Bild."
  />
</div>

<style>
  .page-title {
    margin: 0;
    padding: var(--dt-space-lg) var(--dt-space-lg) var(--dt-space-md);
    font-family: var(--dt-font-display);
    font-weight: var(--dt-font-weight-semibold);
    font-size: var(--dt-text-hero);
    line-height: var(--dt-leading-snug);
    color: var(--dt-color-text-on-media);
    letter-spacing: -0.02em;
  }

  .demo-grid {
    display: grid;
    gap: var(--dt-space-lg);
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    align-items: start;
    padding: 0 var(--dt-space-lg) var(--dt-space-lg);
    box-sizing: border-box;
  }
</style>
