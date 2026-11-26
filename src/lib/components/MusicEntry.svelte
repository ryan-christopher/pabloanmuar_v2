<script lang="ts">
	import type { Picture } from '@sveltejs/enhanced-img';
	import { tick } from 'svelte';
	import vinyl from '#lib/assets/media/vinyl.png?enhanced';
	import { m } from '#lib/paraglide/messages.js';
	import { services, type StreamingUrls } from '#lib/streaming.js';

	type Props = { title: string; artist: string; cover: Picture; credit: string; urls: StreamingUrls };
	let { title, artist, cover, credit, urls }: Props = $props();

	let flipped = $state(false);
	let front: HTMLButtonElement;
	let back: HTMLButtonElement;

	// Keeps keyboard focus on the card, by moving it to the side that's now facing up
	async function flip() {
		flipped = !flipped;
		// The other side can't take focus until it's no longer inert
		await tick();
		(flipped ? back : front).focus();
	}
</script>

<!-- A card that flips over when clicked: the cover on the front, the details and links on the back.
     Only the side facing up can be clicked or tabbed to. Raised while hovered, so its record covers the next card
     rather than sliding under it. z-index steps back down over the record's slide, so it doesn't vanish halfway -->
<div
	class="group relative z-0 transition-[z-index] duration-500 perspective-[1200px] hover:z-10 motion-reduce:transition-none"
>
	<!-- A record tucked behind the cover. When hovered, it slides out to peek from the right, turning as it goes.
	     Stays put once flipped, and on touch screens, which can't hover -->
	<enhanced:img
		src={vinyl}
		alt=""
		sizes="(min-width: 80rem) 18vw, (min-width: 40rem) 28vw, 45vw"
		loading="lazy"
		class={[
			'absolute inset-y-[5%] right-[5%] h-[90%] w-auto transition-transform duration-500 ease-out motion-reduce:transition-none',
			!flipped && 'group-hover:translate-x-[35%] group-hover:rotate-90'
		]}
	/>
	<div
		class={[
			'relative aspect-square transition-transform duration-500 transform-3d motion-reduce:transition-none',
			flipped && 'rotate-y-180'
		]}
	>
		<button
			bind:this={front}
			type="button"
			class="group/front absolute inset-0 cursor-pointer overflow-hidden rounded-sm backface-hidden focus-visible:outline-none"
			aria-label={m.showdetails({ title })}
			inert={flipped}
			onclick={flip}
		>
			<enhanced:img
				src={cover}
				alt=""
				sizes="(min-width: 80rem) 18vw, (min-width: 40rem) 28vw, 45vw"
				loading="lazy"
				class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
			/>
			<!-- A yellow edge, only while hovered or focused. Its own layer over the cover, since the zooming cover
			     would hide a border or outline on the button itself -->
			<span
				class="absolute inset-0 rounded-sm border-2 border-transparent transition-colors duration-300 group-hover:border-mustard group-focus-visible/front:border-mustard"
			></span>
		</button>

		<div
			class="@container absolute inset-0 rotate-y-180 overflow-hidden rounded-sm border-2 border-mustard bg-ink text-paper backface-hidden"
			inert={!flipped}
		>
			<!-- The cover again, mirrored as if seen through from behind, and darkened so the text stays readable.
			     The gray shows until it loads -->
			<enhanced:img
				src={cover}
				alt=""
				sizes="(min-width: 80rem) 18vw, (min-width: 40rem) 28vw, 45vw"
				loading="lazy"
				class="absolute inset-0 h-full w-full -scale-x-100 object-cover"
			/>
			<div class="absolute inset-0 bg-black/75"></div>
			<!-- Covers the whole back, so clicking anywhere but a link flips it back over -->
			<button
				bind:this={back}
				type="button"
				class="absolute inset-0 cursor-pointer"
				aria-label={m.showcover({ title })}
				onclick={flip}
			></button>
			<!-- Over the button above, so the text can scroll if it doesn't fit. Clicks anywhere but a link still flip
			     the card, and the button gives keyboards and screen readers the same thing -->
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<div
				class="absolute inset-0 flex cursor-pointer flex-col overflow-y-auto p-2 text-center @3xs:p-4"
				onclick={(event) => {
					if (!(event.target as Element).closest('a')) flip();
				}}
			>
				<!-- Centered with auto margins rather than justify-center, so text that overflows can scroll to its top.
				     Text sizes follow the card's width rather than the screen's -->
				<div class="my-auto flex flex-col items-center gap-1 @3xs:gap-2">
					<h3 class="font-display text-base leading-tight @3xs:text-xl @xs:text-2xl">{title}</h3>
					<p class="text-xs text-mustard @3xs:text-sm @xs:text-base">{artist}</p>
					<p class="text-xs @3xs:text-sm @xs:text-base">
						<!-- Left off small cards, where there's little room -->
						<span class="sr-only @3xs:not-sr-only">{m.creditlabel()}</span>
						{credit}
					</p>
					<ul class="flex justify-center @3xs:gap-2">
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
										class="block p-1.5 transition-transform duration-200 hover:scale-125 motion-reduce:transition-none @3xs:p-2"
									>
										<svg viewBox="0 0 24 24" class="h-5 w-5 fill-current @3xs:h-6 @3xs:w-6" aria-hidden="true">
											<path d={icon} />
										</svg>
									</a>
								</li>
							{/if}
						{/each}
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>
