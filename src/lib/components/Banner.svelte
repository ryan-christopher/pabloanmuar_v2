<script lang="ts">
	import type { Picture } from '@sveltejs/enhanced-img';
	import { prefersReducedMotion } from 'svelte/motion';
	import { innerHeight, scrollY } from 'svelte/reactivity/window';

	// A short photo strip with a heading over it. The photo drifts as the page scrolls past.
	// `top` is for a banner at the very top of a page, under the navbar: it's taller, keeps the heading clear of
	// the navbar, and loads its photo straight away
	let { image, title, top = false }: { image: Picture; title: string; top?: boolean } = $props();

	let banner: HTMLElement | undefined = $state();

	// Parallax: -1 as the banner enters at the bottom of the screen, 1 as it leaves at the top.
	// Reading scrollY here makes it update on scroll
	const progress = $derived.by(() => {
		const scroll = scrollY.current;
		const height = innerHeight.current;
		if (!banner || scroll === undefined || !height || prefersReducedMotion.current) return 0;
		const { top, height: bannerHeight } = banner.getBoundingClientRect();
		const p = 1 - (2 * (top + bannerHeight)) / (height + bannerHeight);
		return Math.max(-1, Math.min(1, p));
	});
</script>

<div
	bind:this={banner}
	class={[
		'relative isolate flex items-center justify-center overflow-hidden bg-ink px-[5vw]',
		top ? 'h-[26svh] pt-14 lg:h-[32svh] lg:pt-16' : 'h-[12svh] lg:h-[16svh]'
	]}
>
	<!-- 40% taller than the banner (20% each side), so it can shift without showing a gap -->
	<div
		class="absolute inset-x-0 -inset-y-[20%] -z-10 will-change-transform"
		style:transform="translate3d(0, {(progress * 14).toFixed(2)}%, 0)"
		aria-hidden="true"
	>
		<enhanced:img
			src={image}
			alt=""
			sizes="100vw"
			loading={top ? 'eager' : 'lazy'}
			fetchpriority={top ? 'high' : undefined}
			class="absolute inset-0 h-full w-full object-cover"
		/>
	</div>
	<!-- Darkens the photo so the heading stays readable -->
	<div class="absolute inset-0 -z-10 bg-black/40"></div>
	<h2 class="text-center font-display text-[2rem] text-white uppercase sm:text-5xl">{title}</h2>
</div>
