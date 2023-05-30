<script lang="ts">
	import { enhance } from '$app/forms';
	import { Error } from '$lib/components';
	import CancelModal from '$lib/components/CancelModal.svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let loading: boolean;
	let avatarLink: string = data.avatarLink;
	let usernameChange: boolean = false;
	let profilePictureChange: boolean = false;
	let partnerChange: boolean = false;
	$: changesTouched = usernameChange || profilePictureChange;
	$: loading = false;

	function resetChanges(): void {
		usernameChange = false;
		profilePictureChange = false;
		avatarLink = data.avatarLink;
		loading = false;
	}

	function showPreview(event: Event) {
		const target = event.target as HTMLInputElement;
		const files = target.files;

		if (files!.length > 0) {
			avatarLink = URL.createObjectURL(files![0]);
			profilePictureChange = true;
		}
	}

	function removePartnerEnhance() {
		partnerChange = false;
		return async ({ result, update }: { result: any; update: any }) => {
			switch (result.type) {
				case 'success':
					pb.authStore.loadFromCookie(document.cookie);
					break;
			}

			await update();
		};
	}

	function profileUpdateEnhance() {
		loading = true;
		return async ({ result, update }: { result: any; update: any }) => {
			switch (result.type) {
				case 'success':
					pb.authStore.loadFromCookie(document.cookie);
					resetChanges();
					await update();
					break;
				case 'failure':
					await update({ reset: false });
			}
			loading = false;
		};
	}
</script>

{#if partnerChange}
	<CancelModal
		deactiveWording="Remove"
		title="Remove Partner"
		body="You are removing your currently selected partner. This will also remove your partner's link to you. You cannot undo this action"
		onCancel={() => {
			partnerChange = false;
		}}
		formAction={'?/removePartner'}
		enhanceFunction={removePartnerEnhance}
	/>
{/if}

<div class="container bg-white rounded-2xl mx-auto py-3 sm:px-6 lg:px-8">
	{#if form?.error && !form?.success && form?.errorMessages.length === 1}
		<Error mainMessage={form?.errorMessages[0]} />
	{:else if form?.error && !form?.success && form?.errorMessages.length > 1}
		<Error mainMessage="Something went wrong" messages={form?.errorMessages} />
	{/if}
	<form
		method="POST"
		action="?/profileUpdate"
		enctype="multipart/form-data"
		use:enhance={profileUpdateEnhance}
	>
		<div class="mt-3">
			<div class="border-b border-gray-900/10 pb-8">
				<div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
					<div class="col-span-full">
						<div class="mt-2 flex items-center gap-x-3">
							{#if $currentUser?.avatar || profilePictureChange}
								<img
									src={avatarLink}
									class="inline-block object-cover h-20 w-20 rounded-full"
									alt="user avatar"
									id="avatar-preview"
								/>
							{:else}
								<svg
									class="h-24 w-24 text-gray-300"
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
							<label
								for="avatar"
								class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
							>
								<span>Change</span>
								<input
									id="avatar"
									name="avatar"
									type="file"
									class="sr-only"
									accept="image/*"
									disabled={loading}
									on:change={showPreview}
								/>
							</label>
						</div>

						<div class="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
							<dl
								class="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6"
							>
								<div class="pt-6 sm:flex">
									<h2
										class="text-base font-semibold leading-7 text-gray-900 sm:w-64 sm:flex-none sm:pr-6"
									>
										Username
									</h2>
									<!-- <dt class="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Username</dt> -->
									<dd class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
										{#if usernameChange}
											<div
												class="flex lg:w-1/3 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
											>
												<input
													type="text"
													name="username"
													id="username"
													class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
													placeholder={$currentUser?.username}
													disabled={loading}
												/>
											</div>
										{:else}
											<div class="text-gray-900">{$currentUser?.username}</div>
											<button
												type="button"
												class="font-semibold text-indigo-600 hover:text-indigo-500"
												on:click={() => (usernameChange = true)}
											>
												Update
											</button>
										{/if}
									</dd>
								</div>

								<div class="pt-6 sm:flex">
									<h2
										class="text-base font-semibold leading-7 text-gray-900 sm:w-64 sm:flex-none sm:pr-6"
									>
										Partner
									</h2>
									<dd class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
										{#if data.partnerRecord}
											<div class="text-gray-900">
												{data.partnerRecord.first_name} ({data.partnerRecord.username})
											</div>
											<button
												type="button"
												on:click={() => (partnerChange = true)}
												class="font-semibold text-indigo-600 hover:text-indigo-500">Remove</button
											>
										{:else}
											<div class="text-gray-900">---</div>
										{/if}
									</dd>
								</div>
							</dl>
						</div>
					</div>
				</div>
			</div>

			{#if changesTouched}
				<div class="mt-3 mb-3 flex items-center justify-end gap-x-6">
					<button
						type="button"
						class="text-sm font-semibold leading-6 text-gray-900"
						disabled={loading}
						on:click={resetChanges}
					>
						Cancel
					</button>
					<button
						type="submit"
						class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						disabled={loading}
					>
						Save
					</button>
				</div>
			{/if}
		</div>
	</form>
</div>
