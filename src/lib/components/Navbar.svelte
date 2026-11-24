<script lang="ts">
	import { MediaQuery } from 'svelte/reactivity';
	import { scrollY } from 'svelte/reactivity/window';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { m } from '#lib/paraglide/messages.js';
	import { deLocalizeHref, getLocale, localizeHref, setLocale } from '#lib/paraglide/runtime.js';

	const links = [
		{ href: '/', label: m.home },
		{ href: '/portfolio', label: m.portfolio },
		// The About section of the home page
		{ href: '/#about', label: m.about },
		// The footer, scrolled to on the home page
		{ href: '/#contact', label: m.contact }
	];

	const isHome = $derived(deLocalizeHref(page.url.pathname) === '/');

	// How far to scroll, in pixels, before the background appears
	const SCROLL_THRESHOLD = 100;
	// scrollY is undefined during server rendering
	const scrolled = $derived((scrollY.current ?? 0) > SCROLL_THRESHOLD);

	// Mobile menu. Ignored at Tailwind's `lg` breakpoint and up, where the links are always visible
	const desktop = new MediaQuery('min-width: 64rem');
	let menuToggled = $state(false);
	const menuOpen = $derived(menuToggled && !desktop.current);
	let menuHeight = $state(0);
	let nav: HTMLElement;
	let menuButton: HTMLButtonElement;

	// White links and doodle, for when nothing but the landing photo is behind them
	const overPhoto = $derived(isHome && !scrolled && !menuOpen);

	afterNavigate(() => {
		menuToggled = false;
	});

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && menuOpen) {
			menuToggled = false;
			menuButton.focus();
		}
	}

	// Close when tapping outside the navbar
	function onclick(event: MouseEvent) {
		if (menuOpen && !nav.contains(event.target as Node)) menuToggled = false;
	}

	const bar =
		'h-0.5 w-full rounded bg-current transition duration-300 motion-reduce:transition-none';

	const languages = [
		{ locale: 'en', label: 'English' },
		{ locale: 'es', label: 'Español' }
	] as const;
</script>

<svelte:window {onkeydown} {onclick} />

<!-- Stays at the top while scrolling. On the home page it floats over the full-screen landing photo -->
<nav
	bind:this={nav}
	class={[
		'inset-x-0 top-0 z-50 flex items-center justify-between gap-x-6 px-6 py-1.5 font-display transition-colors duration-300',
		isHome ? 'fixed' : 'sticky',
		overPhoto && 'text-white'
	]}
>
	<!-- One background for the bar and the mobile menu, so there's no seam between their blurs. It grows
	     in step with the menu unrolling. It's not on the nav itself because the menu overflows the nav -->
	<div
		class={[
			'absolute inset-x-0 top-0 -z-10 transition-[height,background-color,backdrop-filter] duration-300 ease-out motion-reduce:transition-none',
			(menuOpen || scrolled) && 'bg-white/75 backdrop-blur-sm'
		]}
		style:height="calc(100% + {menuOpen ? menuHeight : 0}px)"
	></div>

	<!-- 180px wide covers high-density screens. Turns white over the landing photo, like the links -->
	<a href={localizeHref('/')} class="shrink-0" aria-label={m.home()}>
		<enhanced:img
			src="#lib/assets/media/pabloDoodle.png?w=180"
			alt=""
			sizes="52px"
			class={[
				'h-11 w-auto max-w-none transition-[filter] duration-300 lg:h-13',
				overPhoto && 'brightness-0 invert'
			]}
		/>
	</a>

	<!-- Centered on the screen, regardless of what's on either side -->
	<span
		class="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl whitespace-nowrap xl:text-3xl"
	>
		PABLO.ANMUAR
	</span>

	<button
		bind:this={menuButton}
		type="button"
		class="-mr-2 cursor-pointer p-2 lg:hidden"
		aria-label={m.menu()}
		aria-expanded={menuOpen}
		aria-controls="nav-links"
		onclick={() => (menuToggled = !menuToggled)}
	>
		<!-- Three bars that fold into an X while the menu is open -->
		<span class="flex h-7 w-7 flex-col justify-center gap-1.5" aria-hidden="true">
			<span class={[bar, menuOpen && 'translate-y-2 rotate-45']}></span>
			<span class={[bar, menuOpen && 'opacity-0']}></span>
			<span class={[bar, menuOpen && '-translate-y-2 -rotate-45']}></span>
		</span>
	</button>

	<!-- A row on larger screens, a drop-down panel on phones and tablets, where the name leaves no room for the row -->
	<div
		id="nav-links"
		bind:offsetHeight={menuHeight}
		class={[
			'absolute inset-x-0 top-full flex max-h-[calc(100svh-3.5rem)] flex-col items-center gap-2 overflow-y-auto px-6 pb-4 text-xl text-ink',
			'lg:static lg:max-h-none lg:flex-row lg:gap-4 xl:gap-6 lg:overflow-visible lg:p-0 lg:text-base lg:text-inherit',
			// Unrolls from the top. `invisible` keeps the closed menu out of the tab order
			'max-lg:transition-[clip-path,visibility] max-lg:duration-300 max-lg:ease-out max-lg:motion-reduce:transition-none',
			menuOpen
				? 'max-lg:[clip-path:inset(0)]'
				: 'max-lg:invisible max-lg:[clip-path:inset(0_0_100%_0)]'
		]}
	>
		{#each links as link (link.href)}
			<a
				href={localizeHref(link.href)}
				class="py-2 hover:underline lg:py-0"
				class:font-bold={deLocalizeHref(page.url.pathname) === link.href}
				onclick={() => (menuToggled = false)}
			>
				{link.label()}
			</a>
		{/each}

		<!-- Only offer the language that isn't in use -->
		{#each languages.filter(({ locale }) => locale !== getLocale()) as { locale, label } (locale)}
			<button
				type="button"
				lang={locale}
				class="cursor-pointer py-2 hover:underline lg:py-0"
				onclick={() => setLocale(locale)}
			>
				{label}
			</button>
		{/each}
	</div>
</nav>
