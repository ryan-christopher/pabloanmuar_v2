<script lang="ts">
	import NewReleases from '#lib/components/NewReleases.svelte';
</script>

<!-- Fills the whole screen when scrolled to: the negative scroll margin cancels the navbar-height
     scroll padding set in layout.css, and the top padding keeps the text clear of the navbar -->
<section
	class="-scroll-mt-14 flex min-h-svh w-full flex-col items-center bg-ink px-6 pt-16 pb-12 text-paper lg:-scroll-mt-16 lg:pt-18"
>
	<NewReleases />
</section>
