<script lang="ts">
	import './layout.css';
	import appleTouchIcon from '#lib/assets/apple-touch-icon.png';
	import favicon from '#lib/assets/favicon.png';
	import Navbar from '#lib/components/Navbar.svelte';
	import { page } from '$app/state';
	import { locales, localizeHref } from '#lib/paraglide/runtime.js';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/png" href={favicon} />
	<link rel="apple-touch-icon" href={appleTouchIcon} />
	<title>Pablo Anmuar</title>
	<!-- Tell search engines about the other-language version of each page -->
	{#each locales as locale (locale)}
		<link
			rel="alternate"
			hreflang={locale}
			href={new URL(localizeHref(page.url.pathname, { locale }), page.url.origin).href}
		/>
	{/each}
</svelte:head>

<Navbar />

<main>
	{@render children()}
</main>
