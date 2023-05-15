import type { PageData, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		const resultList = await locals.pb.collection('daily_wins').getList(1, 50, {
			sort: '-created'
		});

		const pageData: PageData = {
			wins: structuredClone(resultList)
		};

		return pageData;
	}

	const emptyPageData: PageData = {};
	return emptyPageData;
};
