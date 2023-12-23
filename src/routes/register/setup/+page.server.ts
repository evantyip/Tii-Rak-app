import { redirect, type Actions, fail } from '@sveltejs/kit';
import { z } from 'zod';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import type { PageData, PageServerLoad } from './$types';
import { ClientResponseError } from 'pocketbase';

const setupSchema = z.object({
	username: z.string().min(4, 'Username must contain at least 4 characters').trim(),
	first_name: z.string().min(1, 'First Name cannot be blank').trim()
});

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.user && locals.user.first_name) {
		throw redirect(303, '/');
	}

	if (!locals.user) {
		const fromUrl = url.pathname + url.search;
		throw redirect(303, `/login?redirectTo=${fromUrl}`);
	}

	const form = await superValidate(setupSchema);

	const emptyPageData: PageData = {
		form
	};

	return emptyPageData;
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const form = await superValidate(request, setupSchema);
		const { data } = form;

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await locals.pb.collection('users').update(locals.user?.id as string, data);
		} catch (err) {
			console.log(err);

			if (err instanceof ClientResponseError && err.data.data.username) {
				return setError(form, 'username', err.data.data.username.message);
			}

			if (err instanceof ClientResponseError && err.data.data.first_name) {
				return setError(form, 'first_name', err.data.data.first_name.message);
			}

			return message(form, { type: 'error', text: 'Something went wrong' });
		}

		throw redirect(303, '/');
	}
};
