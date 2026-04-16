<script lang="ts">
  let { imageURL, name = "Component Name", description } = $props();
</script>

<h1>Hello {name.toUpperCase()}</h1>
<img src={imageURL} alt="The {name} Image" />
<p>{description}</p>

<style>
  h1 {
    color: blue;
  }
</style>
