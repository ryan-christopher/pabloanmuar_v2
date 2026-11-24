<script lang="ts">
	import { artistUrls, services } from '#lib/streaming.js';

	const links = services.map((service) => ({ ...service, href: artistUrls[service.id] }));
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
