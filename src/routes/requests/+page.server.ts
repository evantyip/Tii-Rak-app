import { redirect, type Actions } from '@sveltejs/kit';
import type { PageData, PageServerLoad } from './$types';
import { ClientResponseError } from 'pocketbase';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		const fromUrl = url.pathname + url.search;
		throw redirect(303, `/login?redirectTo=${fromUrl}`);
	}

	if (locals.user.partner !== '') {
		throw redirect(303, '/');
	}

	const resultList = await locals.pb.collection('partner_requests').getList(1, 10, {
		filter: `to_partner = "${locals.user.id}"`,
		sort: '-created',
		expand: 'from_user'
	});

	const pageData: PageData = {
		requests: structuredClone(resultList)
	};

	return pageData;
};

export const actions: Actions = {
	partnerRequest: async ({ locals, request }) => {
		const data = Object.fromEntries(await request.formData()) as {
			username: string;
		};

		if (!data.username) {
			return { error: true, errorMessages: ['Search field cannot be empty'] };
		}

		try {
			const requestedPartner = await locals.pb
				.collection('users')
				.getFirstListItem(`username="${data.username}"`);

			if (requestedPartner.partner !== '') {
				return { error: true, errorMessages: ['Cannot send partner request to user'] };
			}

			const existingPartnerRequest = await locals.pb.collection('partner_requests').getList(1, 1, {
				filter: `from_user = "${locals.user?.id}" && to_partner = "${requestedPartner.id}"`
			});

			if (existingPartnerRequest.totalItems > 0) {
				return { error: true, errorMessages: ['Already sent partner request to user'] };
			}

			await locals.pb.collection('partner_requests').create({
				from_user: locals.user?.id as string,
				to_partner: requestedPartner.id as string
			});
		} catch (err: unknown) {
			console.log(err);
			if (err instanceof ClientResponseError && err.status == 404) {
				return { error: true, errorMessages: ['Username not found'] };
			}
			return { error: true, errorMessages: ['Something went wrong'] };
		}

		return { success: true };
	}
};
