<script lang="ts">
	import About from '#lib/components/About.svelte';
	import Guitar from '#lib/components/guitar/Guitar.svelte';
	import Intro from '#lib/components/Intro.svelte';
	import Landing from '#lib/components/Landing.svelte';
	import { m } from '#lib/paraglide/messages.js';
	import { media } from '#lib/media.js';
</script>

<svelte:head>
	<title>{m.home()} | Pablo Anmuar</title>
</svelte:head>

<Landing />
<Intro />
<About />

<section class="px-6 py-12">
	<p class="text-neutral-600">TODO: port the React Home page.</p>
	<!-- enhanced-img demo: a works.json cover, served as AVIF/WebP at 1x and 2x for sharp screens -->
	<enhanced:img
		src={media('media/covers/HouseShow.png')}
		alt="HOUSE SHOW cover"
		class="mt-8 w-1/2 rounded-lg md:w-80"
	/>
	<!-- Threlte demo: the 3D guitar ported from components/Guitar.js. Move it into About when that's ported. -->
	<div class="mt-8">
		<Guitar />
	</div>
</section>
