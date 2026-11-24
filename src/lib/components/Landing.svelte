<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { scrollY } from 'svelte/reactivity/window';
	import ears from '#lib/assets/media/ears.jpg?w=640;1024;1536;2048&enhanced';
	import concert from '#lib/assets/media/concert4.jpg?w=640;1024;1600&enhanced';
	import guitar from '#lib/assets/media/guitarsmile.jpg?w=640;1024;1536;2048&enhanced';
	import SocialLinks from '#lib/components/SocialLinks.svelte';
	import { m } from '#lib/paraglide/messages.js';

	// Background photos, shown in this order
	const slides = [ears, concert, guitar];
	const SLIDE_MS = 6000;

	// Parallax strength: 0 scrolls with the page, 1 keeps the photos fixed in place
	const PARALLAX = 0.3;

	// Clamped at 0 so Safari's overscroll bounce doesn't pull the photos up and leave a gap
	const offset = $derived(
		prefersReducedMotion.current ? 0 : Math.max(0, scrollY.current ?? 0) * PARALLAX
	);

	let section: HTMLElement;

	function scrollToNext() {
		section.nextElementSibling?.scrollIntoView({
			behavior: prefersReducedMotion.current ? 'instant' : 'smooth'
		});
	}

	let current = $state(0);

	$effect(() => {
		const timer = setInterval(() => {
			current = (current + 1) % slides.length;
		}, SLIDE_MS);
		return () => clearInterval(timer);
	});
</script>

<!-- svh rather than vh, so mobile browser toolbars don't cover the bottom -->
<section
	bind:this={section}
	class="relative isolate flex min-h-svh w-full flex-col items-center justify-end overflow-hidden bg-ink text-white"
>
	<div class="absolute inset-0 -z-10" aria-hidden="true">
		<div class="absolute inset-0 will-change-transform" style:transform="translate3d(0, {offset}px, 0)">
			{#each slides as slide, i (i)}
				<enhanced:img
					src={slide}
					alt=""
					sizes="100vw"
					fetchpriority={i === 0 ? 'high' : 'low'}
					class={[
						'absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 motion-reduce:transition-none',
						i === current ? 'opacity-100' : 'opacity-0'
					]}
				/>
			{/each}
		</div>
		<!-- Darkens the photos so the text stays readable -->
		<div class="absolute inset-0 bg-black/50"></div>
	</div>

	<!-- Not shown, since the name is in the navbar, but screen readers and search engines need a heading -->
	<h1 class="sr-only">Pablo Anmuar</h1>
	<p class="mt-6 mb-6 px-6 text-center font-display text-xl text-balance sm:text-xl lg:text-2xl">
		{m.landing()}
	</p>
	<div class="px-4">
		<SocialLinks />
	</div>
	<button
		type="button"
		class="mt-6 mb-4 cursor-pointer p-2 motion-safe:animate-nudge sm:mb-6"
		aria-label={m.scrolldown()}
		onclick={scrollToNext}
	>
		<svg
			viewBox="0 0 24 24"
			class="h-8 w-8 fill-none stroke-current stroke-2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="M5 9l7 7 7-7" />
		</svg>
	</button>
</section>
