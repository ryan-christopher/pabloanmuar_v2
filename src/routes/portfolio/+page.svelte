<script lang="ts">
	import ears from '#lib/assets/media/ears.jpg?w=640;1024;1200&enhanced';
	import bedroom from '#lib/assets/media/bedroom3.jpg?w=640;800&enhanced';
	import Banner from '#lib/components/Banner.svelte';
	import MusicEntry from '#lib/components/MusicEntry.svelte';
	import VideoSlideshow from '#lib/components/VideoSlideshow.svelte';
	import works from '#lib/data/works.json';
	import { media } from '#lib/media.js';
	import { m } from '#lib/paraglide/messages.js';

	// works.json names each credit by its key in messages/, so it's shown in the current language
	const credit = (key: string) => (m[key as keyof typeof m] as () => string)();
</script>

<!-- Not shown, but gives the page a main heading for screen readers and search engines -->
<h1 class="sr-only">{m.portfolio()}</h1>

<!-- Clipped sideways, so records peeking out of the right-hand column don't make the page scroll -->
<section id="music" class="overflow-x-clip bg-ink text-paper">
	<Banner image={ears} title={m.music()} top />
	<!-- In the order of works.json -->
	<ul
		class="mx-auto grid grid-cols-2 gap-3 px-[5vw] py-10 sm:grid-cols-3 sm:gap-5 md:w-[85vw] lg:py-14 xl:w-full xl:grid-cols-5 xl:gap-6"
	>
		{#each works as work (work.title)}
			<li>
				<MusicEntry
					title={work.title}
					artist={work.artist}
					cover={media(work.photo)}
					credit={credit(work.credited)}
					urls={{ spotify: work.spotlink, youtube: work.ytlink, apple: work.applelink }}
				/>
			</li>
		{/each}
	</ul>
</section>

<!-- The same dark gray as the home page's intro, like the music section -->
<section id="videos" class="bg-ink text-paper">
	<Banner image={bedroom} title={m.videos()} />
	<VideoSlideshow />
</section>
