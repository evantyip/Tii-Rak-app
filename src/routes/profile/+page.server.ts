import { redirect, type Actions, fail } from '@sveltejs/kit';
import type { PageData, PageServerLoad } from './$types';
import { ClientResponseError } from 'pocketbase';
import { getImageURL } from '$lib/utils';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		const fromUrl = url.pathname + url.search;
		throw redirect(303, `/login?redirectTo=${fromUrl}`);
	}

	if (locals.user && !locals.user.first_name) {
		throw redirect(303, '/register/setup');
	}

	if (locals.user.partner) {
		const partnerRecord = await locals.pb.collection('users').getOne(locals.user.partner);
		return {
			partnerRecord: structuredClone(partnerRecord),
			avatarLink: getImageURL(
				locals.user.collectionId,
				locals.user.id,
				locals.user.avatar,
				'500x500'
			)
		};
	}

	const pageData: PageData = {
		avatarLink: getImageURL(locals.user.collectionId, locals.user.id, locals.user.avatar, '500x500')
	};

	return pageData;
};

export const actions: Actions = {
	profileUpdate: async ({ locals, request }) => {
		const data = await request.formData();
		const userAvatar = data.get('avatar') as File;
		const username = data.get('username');

		if (userAvatar.size === 0) {
			data.delete('avatar');
		}

		if (username === '') {
			data.delete('username');
		}

		if (locals.user) {
			try {
				const result = await locals.pb.collection('users').update(locals.user?.id as string, data);

				locals.user = structuredClone(result);
			} catch (err: unknown) {
				if (err instanceof ClientResponseError && err.data.data.avatar) {
					return fail(422, {
						error: true,
						errorMessages: [err.data.data.avatar.message]
					});
				}

				if (err instanceof ClientResponseError && err.data.data.username) {
					return fail(422, {
						error: true,
						errorMessages: [err.data.data.username.message]
					});
				}

				return fail(500, {
					error: true,
					errorMessages: ['Something went wrong']
				});
			}

			return { success: true };
		}
	},
	removePartner: async ({ locals }) => {
		try {
			const partnerId = locals.user?.partner as string;
			await locals.pb.collection('users').update(partnerId, { partner: null });
			await locals.pb.collection('users').update(locals.user?.id as string, { partner: null });
		} catch (err) {
			console.log(err);

			return fail(500, {
				error: true,
				errorMessages: ['Something went wrong']
			});
		}

		return {
			success: true
		};
	}
};
