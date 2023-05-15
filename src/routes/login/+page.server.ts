import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ locals, request, url }) => {
		const data = Object.fromEntries(await request.formData()) as {
			email: string;
			password: string;
		};

		try {
			await locals.pb.collection('users').authWithPassword(data.email, data.password);
		} catch (err) {
			console.error(err);
			throw err;
		}

		const redirectTo = url.searchParams.get('redirectTo');
		if (redirectTo) {
			throw redirect(303, `/${redirectTo.slice(1)}`);
		}

		throw redirect(303, '/');
	}
};