<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { innerHeight, scrollY } from 'svelte/reactivity/window';
	import gear from '#lib/assets/media/musicgear.jpg?w=640;1024;1356&enhanced';
	import { m } from '#lib/paraglide/messages.js';

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

<section id="about" class="bg-mustard text-ink">
	<div
		bind:this={banner}
		class="relative isolate flex h-[12svh] items-center justify-center overflow-hidden bg-ink px-[5vw] lg:h-[16svh]"
	>
		<!-- 40% taller than the banner (20% each side), so it can shift without showing a gap -->
		<div
			class="absolute inset-x-0 -inset-y-[20%] -z-10 will-change-transform"
			style:transform="translate3d(0, {(progress * 14).toFixed(2)}%, 0)"
			aria-hidden="true"
		>
			<enhanced:img
				src={gear}
				alt=""
				sizes="100vw"
				loading="lazy"
				class="absolute inset-0 h-full w-full object-cover"
			/>
		</div>
		<!-- Darkens the photo so the heading stays readable -->
		<div class="absolute inset-0 -z-10 bg-black/40"></div>
		<h2 class="text-center font-display text-[2rem] text-white uppercase sm:text-5xl">{m.about()}</h2>
	</div>

	<div class="mx-auto px-[5vw] py-8 md:w-[70vw] lg:py-12">
		<p class="lg:text-lg">{m.about1()}</p>
		<p class="mt-6 lg:text-lg">{m.about4()}</p>
	</div>
</section>
