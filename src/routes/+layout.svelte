<script lang="ts">
	import './layout.css';
	import appleTouchIcon from '#lib/assets/apple-touch-icon.png';
	import favicon from '#lib/assets/favicon.png';
	import Footer from '#lib/components/Footer.svelte';
	import Navbar from '#lib/components/Navbar.svelte';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { locales, localizeHref } from '#lib/paraglide/runtime.js';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	// Smooth scrolling is only for links within a page. When going to another page, it would scroll the new
	// page up from wherever the old one was, so jump straight there instead
	beforeNavigate(({ from, to }) => {
		if (to && from?.url.pathname !== to.url.pathname) {
			document.documentElement.style.scrollBehavior = 'auto';
		}
	});

	// Runs once the new page has been scrolled into place
	afterNavigate(() => {
		document.documentElement.style.scrollBehavior = '';
	});
</script>

<svelte:head>
	<link rel="icon" type="image/png" href={favicon} />
	<link rel="apple-touch-icon" href={appleTouchIcon} />
	<title>PABLO.ANMUAR</title>
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

<Footer />
