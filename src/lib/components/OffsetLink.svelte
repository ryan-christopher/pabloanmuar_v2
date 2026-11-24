<script lang="ts">
	import type { Snippet } from 'svelte';

	let { href, children }: { href: string; children: Snippet } = $props();
</script>

<!-- Button-style link with two offset outlines that close in on it when hovered or focused -->
<a {href} class="offset-link relative isolate inline-block rounded-md bg-cinnabar px-4 py-2 font-display text-xl text-white uppercase sm:text-2xl">
	{@render children()}
</a>

<style>
	.offset-link {
		--offset: 8px;
	}

	.offset-link::before,
	.offset-link::after {
		content: '';
		position: absolute;
		z-index: -1;
		border: 2px solid;
		border-radius: 5px;
		transition: inset 0.3s ease-in-out;
	}

	/* Shifted up and to the right */
	.offset-link::before {
		inset: calc(-1 * var(--offset)) calc(-1 * var(--offset)) 0 0;
	}

	/* Shifted down and to the left */
	.offset-link::after {
		inset: 0 0 calc(-1 * var(--offset)) calc(-1 * var(--offset));
	}

	.offset-link:is(:hover, :focus-visible)::before,
	.offset-link:is(:hover, :focus-visible)::after {
		inset: 0;
	}

	@media (prefers-reduced-motion: reduce) {
		.offset-link::before,
		.offset-link::after {
			transition: none;
		}
	}
</style>
