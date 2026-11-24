import type { Reroute } from '@sveltejs/kit/hooks';
import { deLocalizeUrl } from '#lib/paraglide/runtime.js';

// Strip the locale prefix so /es/bio is served by src/routes/bio.
export const reroute: Reroute = (request) => deLocalizeUrl(request.url).pathname;
