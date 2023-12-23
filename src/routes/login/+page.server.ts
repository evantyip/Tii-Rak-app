import { redirect, type Actions, fail } from '@sveltejs/kit';
import { z } from 'zod';
import { message, superValidate } from 'sveltekit-superforms/server';
import type { PageData, PageServerLoad } from './$types';

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1, 'Password cannot be empty')
});

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(303, '/');
	}

	const form = await superValidate(loginSchema);

	const emptyPageData: PageData = {
		form
	};

	return emptyPageData;
};

export const actions: Actions = {
	default: async ({ locals, request, url }) => {
		const form = await superValidate(request, loginSchema);
		const { data } = form;

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await locals.pb.collection('users').authWithPassword(data.email, data.password);
		} catch (err) {
			return message(form, { type: 'error', text: 'Invalid login credentials' });
		}

		const redirectTo = url.searchParams.get('redirectTo');
		if (redirectTo) {
			throw redirect(303, `/${redirectTo.slice(1)}`);
		}

		throw redirect(303, '/');
	}
};
