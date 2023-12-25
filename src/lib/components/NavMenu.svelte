<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { Logo, MobileNav } from '$lib/components';
	import { pb, currentUser } from '$lib/pocketbase';
	import { getImageURL } from '$lib/utils';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let menuShow: boolean = false;

	function pageName(path: string) {
		switch (path) {
			case '/':
				return '';
			case '/wins':
				return 'Slays for the day';
			case '/profile':
				return 'Profile';
			default:
				return '';
		}
	}

	const activeTab = 'bg-eggplant text-white rounded-md py-2 px-3 text-sm font-medium';
	const inactiveTab =
		'text-white hover:bg-carnation-pink hover:bg-opacity-75 rounded-md py-2 px-3 text-sm font-medium';

	const activeDropdownTab = 'block px-4 py-2 text-sm text-gray-700 bg-gray-200';
	const inactiveDropdownTab = 'block px-4 py-2 text-sm text-gray-700';

	function enhanceLogout() {
		return async ({ result }: { result: any }) => {
			menuShow = false;
			pb.authStore.clear();
			await applyAction(result);
		};
	}
</script>

<div class="bg-gradient-to-b from-olivine to-floral-white pb-32">
	<nav class="bg-inherit">
		<div class="mx-auto max-w-7xl px-2 pt-8 sm:px-4 lg:px-8">
			<div class="relative flex h-16 items-center justify-between">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div on:click={() => goto('/')} class="flex items-center px-2 lg:px-0 hover:cursor-pointer">
					<div class="flex-shrink-0 pb-10 h-20 w-20">
						<Logo />
					</div>
					{#if $currentUser}
						<div class="hidden lg:ml-10 lg:block">
							<div class="flex space-x-4">
								<a href="/" class={$page.url.pathname === '/' ? activeTab : inactiveTab}> Home </a>
								<a href="/wins" class={$page.url.pathname === '/wins' ? activeTab : inactiveTab}>
									Wins
								</a>
							</div>
						</div>
					{/if}
				</div>
				<div class="hidden lg:flex lg:flex-1 lg:px-2 lg:ml-6 lg:justify-end">
					{#if $currentUser}
						<div class="relative ml-3">
							<div>
								<button
									type="button"
									class={menuShow
										? 'flex rounded-full text-sm outline-none ring-2 ring-offset-2'
										: 'flex rounded-full text-sm'}
									id="user-menu-button"
									aria-expanded="false"
									aria-haspopup="true"
									on:mouseenter={() => {
										menuShow = true;
									}}
								>
									{#if $currentUser?.avatar}
										<span class="sr-only">Open user menu</span>
										<img
											class="inline-block object-cover h-16 w-16 rounded-full"
											src={getImageURL(
												$currentUser?.collectionId,
												$currentUser?.id,
												$currentUser.avatar,
												'500x500'
											)}
											alt="User Avatar"
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
								</button>
							</div>

							<!--
									Dropdown menu, show/hide based on menu state.
								-->
							{#if menuShow}
								<div
									class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
									role="menu"
									aria-orientation="vertical"
									aria-labelledby="user-menu-button"
									tabindex="-1"
									on:mouseleave={() => (menuShow = false)}
								>
									<a
										href="/profile"
										class={$page.url.pathname === '/profile'
											? activeDropdownTab
											: inactiveDropdownTab}
										role="menuitem"
										tabindex="-1"
										id="user-menu-item-0">Profile</a
									>
									{#if $currentUser.partner === ''}
										<a
											href="/requests"
											class={$page.url.pathname === '/requests'
												? activeDropdownTab
												: inactiveDropdownTab}
											role="menuitem"
											tabindex="-1"
											id="user-menu-item-1">Requests</a
										>
									{/if}
									<form method="POST" action="/logout" use:enhance={enhanceLogout}>
										<button class={inactiveDropdownTab}> Logout </button>
									</form>
								</div>
							{/if}
						</div>
					{:else}
						<a href="/login" class={$page.url.pathname === '/login' ? activeTab : inactiveTab}>
							Login
						</a>
					{/if}
				</div>
			</div>
		</div>

		<!-- Mobile menu, show/hide based on menu state. -->
		<MobileNav {enhanceLogout} />
	</nav>
	<header class="py-6">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<h1 class="text-3xl font-bold tracking-tight text-white">
				{pageName($page.url.pathname)}
			</h1>
		</div>
	</header>
</div>
