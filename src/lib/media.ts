import type { Picture } from '@sveltejs/enhanced-img';

// Album covers referenced by works.json, optimized at build time. Every file matched here is
// built in several formats and sizes, so keep this glob to covers only. For a fixed image, use
// <enhanced:img src="#lib/assets/media/x.jpg" /> directly instead.
const images = import.meta.glob<Picture>('/src/lib/assets/media/covers/*.{png,jpg,jpeg}', {
	eager: true,
	import: 'default',
	query: { enhanced: true }
});

/**
 * Look up an image by the path strings used in works.json (e.g. "media/covers/belair.png"),
 * for passing to <enhanced:img src={...}>.
 */
export function media(path: string): Picture {
	const image = images[`/src/lib/assets/${path}`];
	if (!image) throw new Error(`Image not found: src/lib/assets/${path}`);
	return image;
}
