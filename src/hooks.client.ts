import { PUBLIC_ENVIRONMENT } from '$env/static/public';
import { currentUser, pb } from '$lib/pocketbase';

pb.authStore.loadFromCookie(document.cookie);
pb.authStore.onChange(() => {
	currentUser.set(pb.authStore.model);
	const isProd = PUBLIC_ENVIRONMENT === 'production' ? true : false;
	document.cookie = pb.authStore.exportToCookie({ httpOnly: false, secure: isProd });
});
