/* eslint-disable @typescript-eslint/no-unused-vars */
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pb: import('pocketbase').default;
			user: import('pocketbase').default['authStore']['model'];
		}
		// interface PageData {}
		// interface Platform {}
	}
	namespace svelteHTML {
		interface HTMLAttributes<T> {
			'on:enterViewport'?: (e: CustomEvent) => void;
		}
	}
}

export {};
