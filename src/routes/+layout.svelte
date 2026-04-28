<script lang="ts">
	// +layout.svelte is a shared shell that wraps every route inside this folder.
	// Any route rendered below this layout (e.g. /dogtinder, /login) is injected
	// via {@render children()} — the layout itself stays mounted between navigations.
	import favicon from '$lib/assets/favicon.svg';
	// `page` is a reactive store provided by SvelteKit — always reflects the current URL.
	import { page } from '$app/state';

	// `children` is the current route's +page.svelte, passed in by the SvelteKit router.
	let { children } = $props();

	const tabs = [
		// Each href maps to a subfolder: /dogtinder → src/routes/dogtinder/+page.svelte
		{ label: 'Dog Tinder', href: '/dogtinder' },
		{ label: 'Login', href: '/login' },
	];
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav class="tab-nav">
	{#each tabs as tab}
		<a
			href={tab.href}
			// page.url.pathname is reactive — updates automatically on every navigation.
			aria-current={page.url.pathname === tab.href ? 'page' : undefined}
			class="tab"
			class:tab--active={page.url.pathname === tab.href}
		>
			{tab.label}
		</a>
	{/each}
</nav>

<!-- The matched +page.svelte for the current URL is rendered here. -->
{@render children()}

<style>
	.tab-nav {
		display: flex;
		border-bottom: 2px solid color-mix(in srgb, CanvasText 15%, transparent);
		margin-bottom: 1.5rem;
		padding: 0 1rem;
	}

	.tab {
		padding: 0.6rem 1.2rem;
		text-decoration: none;
		color: color-mix(in srgb, CanvasText 55%, transparent);
		font-weight: 500;
		border-bottom: 2px solid transparent;
		margin-bottom: -2px;
		transition: color 0.15s ease, border-color 0.15s ease;
	}

	.tab:hover {
		color: CanvasText;
	}

	.tab--active {
		color: CanvasText;
		border-bottom-color: CanvasText;
	}
</style>
