<script lang="ts">
	import { services, type StreamingUrls } from '#lib/streaming.js';

	const urls: StreamingUrls = {
		// TODO: replace with the artist's own Tidal page
		tidal: 'https://tidal.com/search?q=PABLO.ANMUAR',
		apple: 'https://music.apple.com/us/artist/pablo-anmuar/1667428210',
		youtube: 'https://www.youtube.com/channel/UChec6FqYBkUM4c1xLnibC-g',
		soundcloud: 'https://soundcloud.com/pabloanmuar',
		spotify: 'https://open.spotify.com/artist/4jPN3jx8MwNtQMJ6PD46yJ'
	};

	const links = services.map((service) => ({ ...service, href: urls[service.id] }));
</script>

<ul class="flex flex-wrap justify-center gap-4 min-[375px]:gap-6 sm:gap-10">
	{#each links as { name, href, icon, color } (name)}
		<li>
			<a
				{href}
				target="_blank"
				rel="noreferrer"
				aria-label={name}
				title={name}
				style:color
				class="block p-2 transition-transform duration-200 hover:scale-125 motion-reduce:transition-none"
			>
				<svg viewBox="0 0 24 24" class="h-7 w-7 fill-current min-[375px]:h-8 min-[375px]:w-8 sm:h-10 sm:w-10" aria-hidden="true">
					<path d={icon} />
				</svg>
			</a>
		</li>
	{/each}
</ul>
