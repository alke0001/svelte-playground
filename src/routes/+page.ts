// +page.ts is the server/shared data-loading file for this route (here: /).
// `load` runs before the page renders — ideal for redirects, data fetching, auth checks.
import { redirect } from '@sveltejs/kit';

export const load = () => {
  // / has no content of its own, so redirect immediately to the default route.
  redirect(307, '/dogtinder');
};