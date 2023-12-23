import { redirect, type Actions, fail } from '@sveltejs/kit';
import { z } from 'zod';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import type { PageData, PageServerLoad } from './$types';
import { ClientResponseError } from 'pocketbase';

const registerSchema = z
	.object({
		email: z.string().email().trim(),
		username: z.string().min(4, 'Username must contain at least 4 characters').trim(),
		first_name: z.string().min(1, 'First Name cannot be blank').trim(),
		password: z.string().min(6, 'Password must contain at least 6 characters'),
		passwordConfirm: z.string()
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: 'Passwords do not match',
		path: ['password']
	});

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(303, '/');
	}

	const form = await superValidate(registerSchema);

	const emptyPageData: PageData = {
		form
	};

	return emptyPageData;
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const form = await superValidate(request, registerSchema);
		const { data } = form;

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await locals.pb.collection('users').create(data);
			await locals.pb.collection('users').authWithPassword(data.email, data.password);
		} catch (err: unknown) {
			console.log(err);

			if (err instanceof ClientResponseError && err.data.data.email) {
				return setError(form, 'email', err.data.data.email.message);
			}

			if (err instanceof ClientResponseError && err.data.data.username) {
				return setError(form, 'username', err.data.data.username.message);
			}

			if (
				err instanceof ClientResponseError &&
				(err.data.data.password || err.data.data.passwordConfirm)
			) {
				return setError(form, 'password', 'Password values do not match');
			}

			return message(form, { type: 'error', text: 'Something went wrong' });
		}

		throw redirect(303, '/');
	}
};
