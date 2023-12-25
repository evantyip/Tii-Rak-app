<script lang="ts">
	import { currentUser } from '$lib/pocketbase';
	import { page } from '$app/stores';
	import { getImageURL } from '$lib/utils';
	import { enhance } from '$app/forms';
	const activeMobileTab = 'bg-eggplant text-white block rounded-md py-2 px-3 text-base font-medium';
	const inactiveMobileTab =
		'text-white hover:bg-carnation-pink hover:bg-opacity-75 block rounded-md py-2 px-3 text-base font-medium';

	export let enhanceLogout: () => void;
</script>

<div class="lg:hidden" id="mobile-menu">
	{#if !$currentUser}
		<div class="space-y-1 px-2 pb-3 pt-2">
			<a
				href="/login"
				class={$page.url.pathname === '/login' ? activeMobileTab : inactiveMobileTab}
			>
				Login
			</a>
		</div>
	{/if}
	{#if $currentUser}
		<div class="space-y-1 px-2 pb-3 pt-6">
			<a href="/" class={$page.url.pathname === '/' ? activeMobileTab : inactiveMobileTab}>Home</a>
			<a href="/wins" class={$page.url.pathname === '/wins' ? activeMobileTab : inactiveMobileTab}
				>Wins</a
			>
		</div>

		<div class="border-t border-eggplant pb-3 pt-4">
			<div class="flex items-center px-4">
				<div class="flex-shrink-0">
					{#if $currentUser.avatar}
						<img
							src={getImageURL(
								$currentUser?.collectionId,
								$currentUser?.id,
								$currentUser.avatar,
								'500x500'
							)}
							class="inline-block object-cover h-20 w-20 rounded-full"
							alt="user avatar"
							id="avatar-preview"
						/>
					{:else}
						<svg
							class="h-10 w-10 text-gray-300"
							viewBox="0 0 24 24"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fill-rule="evenodd"
								d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
								clip-rule="evenodd"
							/>
						</svg>
					{/if}
				</div>
			</div>
		</div>
		<div class="mt-3 space-y-1 px-2">
			<a
				href="/profile"
				class={$page.url.pathname === '/profile' ? activeMobileTab : inactiveMobileTab}>Profile</a
			>
			{#if $currentUser.partner === ''}
				<a
					href="/requests"
					class={$page.url.pathname === '/requests' ? activeMobileTab : inactiveMobileTab}
				>
					Requests
				</a>
			{/if}
			<form class={inactiveMobileTab} method="POST" action="/logout" use:enhance={enhanceLogout}>
				<button class="w-full text-start">Logout</button>
			</form>
		</div>
	{/if}
</div>
