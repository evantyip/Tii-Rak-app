import type { PageData, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		const resultList = await locals.pb.collection('daily_wins').getList(1, 50, {
			fitler: `user = "${locals.user.id}" || user = "${locals.user.partner}"`,
			sort: '-created',
			expand: 'user'
		});

		const pageData: PageData = {
			wins: structuredClone(resultList)
		};

		return pageData;
	}

	const emptyPageData: PageData = {};
	return emptyPageData;
};
