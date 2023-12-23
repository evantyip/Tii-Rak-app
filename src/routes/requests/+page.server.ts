import { redirect, type Actions, fail } from '@sveltejs/kit';
import { z } from 'zod';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import type { PageData, PageServerLoad } from './$types';
import { ClientResponseError } from 'pocketbase';

const schema = z.object({
	username: z.string().min(1, { message: 'Search field cannot be empty' }).trim()
});

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		const fromUrl = url.pathname + url.search;
		throw redirect(303, `/login?redirectTo=${fromUrl}`);
	}

	if (locals.user && !locals.user.first_name) {
		throw redirect(303, '/register/setup');
	}

	if (locals.user.partner !== '') {
		throw redirect(303, '/');
	}

	const resultList = await locals.pb.collection('partner_requests').getList(1, 10, {
		filter: `to_partner = "${locals.user.id}"`,
		sort: '-created',
		expand: 'from_user'
	});

	const form = await superValidate(schema);

	const pageData: PageData = {
		requests: structuredClone(resultList),
		form
	};

	return pageData;
};

export const actions: Actions = {
	partnerRequest: async ({ locals, request }) => {
		const form = await superValidate(request, schema);

		const username = form.data.username;

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const requestedPartner = await locals.pb
				.collection('users')
				.getFirstListItem(`username="${username}"`);

			if (requestedPartner.partner !== '') {
				return setError(form, 'username', 'Cannot send partner request to user');
			}

			const existingPartnerRequest = await locals.pb.collection('partner_requests').getList(1, 1, {
				filter: `from_user = "${locals.user?.id}" && to_partner = "${requestedPartner.id}"`
			});

			if (existingPartnerRequest.totalItems > 0) {
				return setError(form, 'username', 'Already sent partner request to user');
			}

			await locals.pb.collection('partner_requests').create({
				from_user: locals.user?.id as string,
				to_partner: requestedPartner.id as string
			});
		} catch (err: unknown) {
			if (err instanceof ClientResponseError && err.status == 404) {
				return setError(form, 'username', 'Username not found');
			}

			return message(form, { type: 'error', text: 'Something went wrong, please try again.' });
		}

		return message(form, { type: 'success', text: 'Successfully sent request' });
	}
};
