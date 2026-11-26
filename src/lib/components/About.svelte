<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import gear from '#lib/assets/media/musicgear.jpg?w=640;1024;1356&enhanced';
	import guitarBg from '#lib/assets/media/guitarbg.jpg?w=640;1024;1200&enhanced';
	import Banner from '#lib/components/Banner.svelte';
	import Guitar from '#lib/components/guitar/Guitar.svelte';
	import OffsetLink from '#lib/components/OffsetLink.svelte';
	import { m } from '#lib/paraglide/messages.js';

	let bioOpen = $state(false);
	let bioToggle: HTMLElement | undefined = $state();

	function closeBio() {
		bioOpen = false;
		// The X is about to disappear, so put keyboard focus back on the Bio button
		bioToggle?.querySelector('button')?.focus();
	}
</script>

<section id="about" class="bg-mustard text-ink">
	<Banner image={gear} title={m.about()} />

	<div class="mx-auto px-[5vw] py-8 md:w-[70vw] lg:py-12">
		<p class="lg:text-lg">{m.about1()}</p>
		<p class="lg:text-lg">{m.about2()}</p>
		<div class="">
			<Guitar />
		</div>
		<p class="lg:text-lg">{m.about3()}</p>
		<p class="lg:text-lg">{m.about4()}</p>
		<div bind:this={bioToggle} class="mt-8 text-center">
			<!-- The outlines take the button's text color, so they're dark while the label is white -->
			<OffsetLink
				aria-expanded={bioOpen}
				aria-controls="bio"
				onclick={() => (bioOpen = !bioOpen)}
				class="bg-cinnabar px-4 py-2 font-display text-xl text-ink uppercase sm:text-2xl"
			>
				<span class="text-white">{m.bio()}</span>
			</OffsetLink>
		</div>
	</div>

	<!-- Outside the column above, so the photo spans the whole width -->
	<div id="bio">
		{#if bioOpen}
			<!-- slide sets overflow: hidden while it runs, which would make the X stick to this section instead of
			     the window. Clip hides the overflow without doing that; it needs ! to win over the animation -->
			<div
				class="relative isolate overflow-clip! bg-ink text-white"
				transition:slide={{ duration: prefersReducedMotion.current ? 0 : 400 }}
			>
				<enhanced:img
					src={guitarBg}
					alt=""
					sizes="100vw"
					class="absolute inset-0 -z-20 h-full w-full object-cover"
				/>
				<!-- Darkens the photo so the text stays readable -->
				<div class="absolute inset-0 -z-10 bg-black/65"></div>
				<!-- As tall as the section, so the X inside it can stick below the navbar while scrolling -->
				<div class="absolute inset-y-0 right-5 py-5 lg:right-8 lg:py-8">
					<div class="sticky top-19 flex lg:top-21">
						<OffsetLink
							class="bg-cinnabar p-1.5 text-white md:p-2"
							aria-label={m.close()}
							onclick={closeBio}
						>
							<svg
								viewBox="0 0 24 24"
								class="h-5 w-5 fill-none stroke-current stroke-2 md:h-6 md:w-6"
								stroke-linecap="round"
								aria-hidden="true"
							>
								<path d="M5 5l14 14M19 5L5 19" />
							</svg>
						</OffsetLink>
					</div>
				</div>
				<div class="mx-auto space-y-6 px-[5vw] pt-18 pb-8 md:w-[70vw] md:pt-8 lg:py-12 lg:text-lg">
					<p>{m.biop1()}</p>
					<p>{m.biop2()}</p>
					<p>{m.biop3()}</p>
				</div>
			</div>
		{/if}
	</div>
</section>
