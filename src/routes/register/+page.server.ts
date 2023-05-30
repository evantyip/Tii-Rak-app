import { redirect, type Actions, fail } from '@sveltejs/kit';
import type { PageData, PageServerLoad } from './$types';
import { ClientResponseError } from 'pocketbase';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(303, '/');
	}

	const emptyPageData: PageData = {};
	return emptyPageData;
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const data = Object.fromEntries(await request.formData()) as {
			email: string;
			username: string;
			first_name: string;
			password: string;
			passwordConfirm: string;
		};

		try {
			await locals.pb.collection('users').create(data);
			await locals.pb.collection('users').authWithPassword(data.email, data.password);
		} catch (err: unknown) {
			console.log(err);

			if (err instanceof ClientResponseError && err.data.data.email) {
				return fail(422, {
					error: true,
					errorMessages: [err.data.data.email.message]
				});
			}

			if (err instanceof ClientResponseError && err.data.data.username) {
				return fail(422, {
					error: true,
					errorMessages: [err.data.data.username.message]
				});
			}

			if (
				err instanceof ClientResponseError &&
				(err.data.data.password || err.data.data.passwordConfirm)
			) {
				return fail(422, {
					error: true,
					errorMessages: ['Password values do not match']
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
