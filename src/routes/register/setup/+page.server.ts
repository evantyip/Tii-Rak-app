import { redirect, type Actions, fail } from '@sveltejs/kit';
import type { PageData, PageServerLoad } from './$types';
import { ClientResponseError } from 'pocketbase';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.user && locals.user.first_name) {
		throw redirect(303, '/');
	}

	if (!locals.user) {
		const fromUrl = url.pathname + url.search;
		throw redirect(303, `/login?redirectTo=${fromUrl}`);
	}

	const emptyPageData: PageData = {};
	return emptyPageData;
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const data = Object.fromEntries(await request.formData()) as {
			username: string;
			first_name: string;
		};

		try {
			await locals.pb.collection('users').update(locals.user?.id as string, data);
		} catch (err) {
			console.log(err);

			if (err instanceof ClientResponseError && err.data.data.username) {
				return fail(422, {
					error: true,
					errorMessages: [err.data.data.username.message]
				});
			}

			if (err instanceof ClientResponseError && err.data.data.first_name) {
				return fail(422, {
					error: true,
					errorMessages: [err.data.data.first_name.message]
				});
			}

			return fail(500, {
				error: true,
				errorMessages: ['Something went wrong']
			});
		}

		throw redirect(303, '/');
	}
};
