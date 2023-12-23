import { redirect, type Actions, fail } from '@sveltejs/kit';
import { z } from 'zod';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import type { PageData, PageServerLoad } from './$types';
import { ClientResponseError } from 'pocketbase';

const profileSchema = z
	.object({
		avatar: z.instanceof(File),
		username: z.string().min(4, 'Username must include at least 4 characters').optional()
	})
	.partial();

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		const fromUrl = url.pathname + url.search;
		throw redirect(303, `/login?redirectTo=${fromUrl}`);
	}

	if (locals.user && !locals.user.first_name) {
		throw redirect(303, '/register/setup');
	}

	const avatarLink = locals.pb.files.getUrl(
		locals.pb.authStore.model as Pick<
			Record<string, string>,
			'id' | 'collectionId' | 'collectionName'
		>,
		locals.pb.authStore.model?.avatar,
		{ thumb: '500x500' }
	);

	const form = await superValidate(profileSchema);

	const pageData: PageData = {
		avatarLink,
		form
	};

	if (locals.user.partner) {
		const partnerRecord = await locals.pb.collection('users').getOne(locals.user.partner);
		return {
			...pageData,
			partnerRecord: structuredClone(partnerRecord)
		};
	}

	return pageData;
};

export const actions: Actions = {
	profileUpdate: async ({ locals, request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, profileSchema);
		const userAvatar = formData.get('avatar') as File;
		const username = formData.get('username');

		if (!form.valid) {
			return fail(400, { form });
		}

		if (userAvatar.size === 0) {
			formData.delete('avatar');
		}

		if (username === '') {
			formData.delete('username');
		}

		if (locals.user) {
			try {
				const result = await locals.pb
					.collection('users')
					.update(locals.user?.id as string, formData);

				locals.user = structuredClone(result);
			} catch (err: unknown) {
				if (err instanceof ClientResponseError && err.data.data.avatar) {
					return setError(form, 'avatar', err.data.data.avatar.message);
				}

				if (err instanceof ClientResponseError && err.data.data.username) {
					return setError(form, 'username', err.data.data.username.message);
				}

				return message(form, { type: 'error', text: 'Something went wrong' });
			}

			// return message(form, { type: 'success', text: 'Successfully updated profile' });
			return { success: true };
		}
	},
	removePartner: async ({ locals, request }) => {
		const form = await superValidate(request, profileSchema);
		try {
			const partnerId = locals.user?.partner as string;
			await locals.pb.collection('users').update(partnerId, { partner: null });
			await locals.pb.collection('users').update(locals.user?.id as string, { partner: null });
		} catch (err) {
			console.log(err);

			return message(form, { type: 'error', text: 'Something went wrong' });
		}

		return message(form, { type: 'success', text: 'Successfully updated profile' });
	}
};
