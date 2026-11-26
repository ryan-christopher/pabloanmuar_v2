<script lang="ts" module>
	// The parts of YouTube's IFrame Player API used here: https://developers.google.com/youtube/iframe_api_reference
	type YT = {
		Player: new (
			iframe: HTMLIFrameElement,
			options: { events: { onStateChange: (event: { data: number }) => void } }
		) => { destroy(): void };
		PlayerState: { PLAYING: number; BUFFERING: number };
	};
	type YouTubeWindow = Window & { YT?: YT; onYouTubeIframeAPIReady?: () => void };

	let api: Promise<YT> | undefined;

	// Loads the API script the first time it's needed, and shares it after that
	function loadApi() {
		api ??= new Promise((resolve) => {
			const w = window as YouTubeWindow;
			if (w.YT?.Player) return resolve(w.YT);
			const previous = w.onYouTubeIframeAPIReady;
			w.onYouTubeIframeAPIReady = () => {
				previous?.();
				resolve(w.YT!);
			};
			const script = document.createElement('script');
			script.src = 'https://www.youtube.com/iframe_api';
			document.head.append(script);
		});
		return api;
	}
</script>

<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import { page } from '$app/state';
	import OffsetLink from '#lib/components/OffsetLink.svelte';
	import { m } from '#lib/paraglide/messages.js';

	// YouTube video IDs, in the order they're shown
	const videos = [
		'vxUnTcf97fU',
		'1Gpsi6Wzww0',
		'vqf4GZ9E4dg',
		'4B6o47Eu__Y',
		'84Anqc2-K40',
		'uO2_d3x7AFQ',
		'9EDQTycAYw0'
	];

	let current = $state(0);

	// Wraps around at either end
	const go = (step: number) => (current = (current + step + videos.length) % videos.length);

	// How long each video is shown before moving to the next, in milliseconds
	const INTERVAL = 5000;

	let playing = $state(false);
	let hovering = $state(false);
	let onScreen = $state(false);
	let tabHidden = $state(false);

	// Moves on by itself only while no one is watching, about to press play, or unable to see it.
	// People who ask for less motion get the buttons only
	const autoAdvance = $derived(
		!playing && !hovering && onScreen && !tabHidden && !prefersReducedMotion.current
	);

	// Starts a fresh countdown whenever the video changes or it's allowed to move on again
	$effect(() => {
		if (!autoAdvance) return;
		void current;
		const timer = setTimeout(() => go(1), INTERVAL);
		return () => clearTimeout(timer);
	});

	// Watches the video, to know when it's playing. Paused and ended videos let the slideshow move on again
	function watchPlayer(iframe: HTMLIFrameElement) {
		let player: { destroy(): void } | undefined;
		let removed = false;
		loadApi().then((YT) => {
			if (removed) return;
			player = new YT.Player(iframe, {
				events: {
					onStateChange: ({ data }) => {
						playing = data === YT.PlayerState.PLAYING || data === YT.PlayerState.BUFFERING;
					}
				}
			});
		});
		return () => {
			removed = true;
			player?.destroy();
			playing = false;
		};
	}

	function watchOnScreen(element: HTMLElement) {
		const observer = new IntersectionObserver(([entry]) => (onScreen = entry.isIntersecting));
		observer.observe(element);
		return () => observer.disconnect();
	}

	// Made for a dark background: white arrows, and white outlines, which take the buttons' text color
	const arrow = 'h-6 w-6 fill-none stroke-white stroke-2 md:h-7 md:w-7';
</script>

<svelte:document onvisibilitychange={() => (tabHidden = document.hidden)} />

<!-- Phones: the video, then a row of previous, dots and next. Larger screens: the arrows either side of the video,
     with the dots under it -->
<div
	class="mx-auto grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-8 px-[5vw] py-10 md:w-[85vw] md:gap-x-8 lg:py-14 xl:w-[80vw]"
	role="region"
	aria-roledescription="carousel"
	aria-label={m.videos()}
	{@attach watchOnScreen}
	onpointerenter={() => (hovering = true)}
	onpointerleave={() => (hovering = false)}
>
	<OffsetLink
		class="col-start-1 row-start-2 bg-cinnabar p-2 text-white md:row-start-1 md:p-3"
		aria-label={m.previousvideo()}
		onclick={() => go(-1)}
	>
		<svg viewBox="0 0 24 24" class={arrow} stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
			<path d="M15 5l-7 7 7 7" />
		</svg>
	</OffsetLink>

	<!-- Only the current video is on the page, so moving to another one stops whatever was playing.
	     Stacked in one grid cell, so the outgoing and incoming videos can cross-fade without the layout jumping -->
	<div class="col-span-3 row-start-1 grid min-w-0 md:col-span-1 md:col-start-2">
		{#key current}
			<iframe
				class="col-start-1 row-start-1 aspect-video w-full rounded-md bg-ink"
				src="https://www.youtube-nocookie.com/embed/{videos[current]}?enablejsapi=1&origin={page.url.origin}"
				title={m.videoof({ current: current + 1, total: videos.length })}
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				referrerpolicy="strict-origin-when-cross-origin"
				allowfullscreen
				transition:fade={{ duration: prefersReducedMotion.current ? 0 : 300 }}
				{@attach watchPlayer}
			></iframe>
		{/key}
	</div>

	<OffsetLink
		class="col-start-3 row-start-2 bg-cinnabar p-2 text-white md:row-start-1 md:p-3"
		aria-label={m.nextvideo()}
		onclick={() => go(1)}
	>
		<svg viewBox="0 0 24 24" class={arrow} stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
			<path d="M9 5l7 7-7 7" />
		</svg>
	</OffsetLink>

	<!-- One dot per video, to jump straight to it -->
	<ul class="col-start-2 row-start-2 flex justify-center gap-3">
		{#each videos as id, i (id)}
			<li>
				<button
					type="button"
					class={[
						'block h-3 w-3 cursor-pointer rounded-full border-2 border-paper transition-colors duration-300',
						i === current ? 'bg-paper' : 'hover:bg-mustard'
					]}
					aria-label={m.videoof({ current: i + 1, total: videos.length })}
					aria-current={i === current}
					onclick={() => (current = i)}
				></button>
			</li>
		{/each}
	</ul>
</div>
