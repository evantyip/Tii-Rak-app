import { redirect } from '@sveltejs/kit';
import type { PageData, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
	if (!locals.user) {
		const fromUrl = url.pathname + url.search;
		throw redirect(302, `/login?redirectTo=${fromUrl}`);
	}

	if (locals.user && !locals.user.first_name) {
		throw redirect(303, '/register/setup');
	}

	const pageData: PageData = {};

	return pageData;
};
