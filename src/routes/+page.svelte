<script lang="ts">
  import ProfileCard from "$lib/ProfileCard.svelte";
</script>

<h1>Welcome to SvelteKit</h1>

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
    userName="Nur Default"
    shortDescription="Kein pictureFolder — Fallback-Bild."
  />
</div>

<style>
  h1 {
    margin-bottom: 1rem;
  }

  .demo-grid {
    display: grid;
    gap: 1.25rem;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    align-items: start;
  }
</style>
