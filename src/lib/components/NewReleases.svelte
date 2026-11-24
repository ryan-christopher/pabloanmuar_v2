<script lang="ts">
	import OffsetLink from '#lib/components/OffsetLink.svelte';
	import { media } from '#lib/media.js';
	import { m } from '#lib/paraglide/messages.js';
	import { localizeHref } from '#lib/paraglide/runtime.js';
	import { services, type StreamingUrls } from '#lib/streaming.js';

	type Release = { title: string; photo: string; description?: () => string; urls: StreamingUrls };

	// Newest first: the first is shown large, the rest as a row of cards. To add one, put its cover in assets/media/covers and the first one's description in messages/
	const releases: Release[] = [
		{
			title: 'Déjate Llevar',
			photo: 'media/covers/Dejate.png',
			description: m.latestrelease,
			urls: {
				apple: 'https://music.apple.com/us/album/d%C3%A9jate-llevar/6802426069?i=6802426070',
				youtube: 'https://youtu.be/6LWOIAYZDPc?si=YqqBDoxL6FLAYpqW',
				spotify: 'https://open.spotify.com/intl-es/track/0zvVf0ncEEPi0Qc4wSrVTq?si=dc0dfa28a8144e7a'
			}
		},
		{
			title: 'For the First Time',
			photo: 'media/covers/4d1stx.jpg',
			urls: {
				apple: 'https://music.apple.com/us/album/for-the-first-time/1878107559?i=1878107560',
				youtube: 'https://youtu.be/vxUnTcf97fU?si=maX_j0gY1muBCdFv',
				spotify: 'https://open.spotify.com/intl-es/track/152GowTGYq2q9ztKUjyGRT?si=3e28e26eb6f24e3a'
			}
		},
		{
			title: 'M.E.G.',
			photo: 'media/covers/MEG.png',
			urls: {
				apple: 'https://music.apple.com/us/album/m-e-g-feat-trisano-swell-mclovin-valeria-orrantia-single/1805966562',
				youtube: 'https://youtu.be/Occ-UjJ0vzg?si=m2IJQ_AjVsYvgdXl',
				spotify: 'https://open.spotify.com/track/4Wxh8xoRERDVSJC8OQI9Iq?si=e462d9bd56d4492f'
			}
		},
		{
			title: 'CHOPPED CHEESE',
			photo: 'media/covers/chopped.jpg',
			urls: {
				apple: 'https://music.apple.com/us/album/chopped-cheese-single/1774595959',
				youtube: 'https://youtu.be/vqf4GZ9E4dg',
				spotify: 'https://open.spotify.com/track/0uRHeknUizDfuVEhDKLYOD'
			}
		}
	];

	const [featured, ...others] = releases;
</script>

{#snippet streamingLinks({ title, urls }: Release, listClass: string, iconClass: string)}
	<ul class={['flex flex-wrap justify-center', listClass]}>
		{#each services as { id, name, color, icon } (id)}
			{#if urls[id]}
				<li>
					<a
						href={urls[id]}
						target="_blank"
						rel="noreferrer"
						aria-label="{title}: {name}"
						title={name}
						style:color
						class="block p-2 transition-transform duration-200 hover:scale-125 motion-reduce:transition-none"
					>
						<svg viewBox="0 0 24 24" class={['fill-current', iconClass]} aria-hidden="true">
							<path d={icon} />
						</svg>
					</a>
				</li>
			{/if}
		{/each}
	</ul>
{/snippet}

<div class="flex w-full max-w-5xl flex-col">
	<h2 class="mb-8 text-center font-display text-[2rem] text-balance sm:text-5xl">{m.newreleases()}</h2>
	<article class="grid items-center gap-6 md:grid-cols-2 md:gap-10 lg:grid-cols-[24rem_1fr] lg:gap-16">
		<enhanced:img
			src={media(featured.photo)}
			alt="{featured.title} cover"
			sizes="(min-width: 48rem) 50vw, 100vw"
			loading="lazy"
			class="mx-auto h-auto w-full max-w-xs rounded-lg md:max-w-none"
		/>
		<div class="flex flex-col items-center gap-5 text-center md:items-start md:text-left">
			<h3 class="font-display text-2xl sm:text-3xl lg:text-4xl">{featured.title}</h3>
			{#if featured.description}
				<p class="text-left lg:text-lg">{featured.description()}</p>
			{/if}
			{@render streamingLinks(featured, 'w-full gap-6', 'h-8 w-8')}
		</div>
	</article>

	<ul class="mt-14 grid gap-6 sm:grid-cols-3 sm:gap-8 lg:mt-20 lg:gap-12">
		{#each others as release (release.title)}
			<!-- Phones: cover beside the text. Wider screens: cover above it -->
			<li class="flex items-center gap-5 border-mustard text-center max-sm:not-first:border-t max-sm:not-first:pt-6 sm:flex-col sm:gap-4">
				<div class="w-24 shrink-0 sm:w-full">
					<enhanced:img
						src={media(release.photo)}
						alt="{release.title} cover"
						sizes="(min-width: 40rem) 33vw, 8rem"
						loading="lazy"
						class="aspect-square h-auto w-full rounded-lg object-cover"
					/>
				</div>
				<div class="flex min-w-0 flex-1 flex-col gap-2 sm:w-full sm:flex-none sm:items-center sm:gap-3">
					<h3 class="font-display text-xl lg:text-2xl">{release.title}</h3>
					{@render streamingLinks(release, 'gap-1 sm:gap-3', 'h-6 w-6')}
				</div>
			</li>
		{/each}
	</ul>

	<div class="mt-16 mb-4 text-center lg:mt-20">
		<OffsetLink href={localizeHref('/portfolio')}>{m.portfolio()}</OffsetLink>
	</div>
</div>
