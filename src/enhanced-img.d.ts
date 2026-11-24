// enhanced-img only declares '*?enhanced'; this covers imports that also pass options,
// e.g. 'photo.jpg?w=640;1024&enhanced'
declare module '*&enhanced' {
	import type { Picture } from '@sveltejs/enhanced-img';

	const value: Picture;
	export default value;
}
