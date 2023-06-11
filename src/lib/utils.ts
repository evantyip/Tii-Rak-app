import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

export const getImageURL = (
	collectionId: string,
	recordId: string,
	fileName: string,
	size = '0x0'
): string => {
	return `${PUBLIC_POCKETBASE_URL}/api/files/${collectionId}/${recordId}/${fileName}?thumb=${size}`;
};

export const TIMELINE_LOAD_AMOUNT = 7;
