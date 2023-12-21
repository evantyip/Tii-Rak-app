<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { writable } from 'svelte/store';
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { getImageURL } from '$lib/utils';

	interface PartnerRequest {
		id: string;
		collectionId: string;
		collectionName: string;
		created: string;
		updated: string;
		from_user: string;
		invite_message: string;
		to_partner: string;
		expand: any;
	}

	interface PartnerRequests {
		page: number;
		perPage: number;
		totalPages: number;
		totalItems: number;
		items: PartnerRequest[];
	}

	interface PageData {
		requests: PartnerRequests;
	}

	export let data: PageData;
	export let form: ActionData;
	let requests = writable<PartnerRequest[]>(data.requests.items);

	async function acceptRequest(index: number) {
		const partnerRequest = $requests[index];

		try {
			await pb.collection('users').update(partnerRequest.from_user, {
				partner: partnerRequest.to_partner
			});
			await pb.collection('users').update(partnerRequest.to_partner, {
				partner: partnerRequest.from_user
			});
			await pb.collection('partner_requests').delete(partnerRequest.id);

			requests.update((requests) => requests.filter((_, i) => i !== index));
		} catch (err) {
			console.log(err);
		}
	}

	async function declineRequest(index: number) {
		const partnerRequest = $requests[index];

		try {
			await pb.collection('partner_requests').delete(partnerRequest.id);
			requests.update((requests) => requests.filter((_, i) => i !== index));
		} catch (err) {
			console.error(err);
		}
	}
</script>

<div class="container bg-white rounded-2xl mx-auto py-3 sm:px-6 lg:px-8">
	<div class="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
		<h3 class="text-2xl font-semibold leading-6 text-gray-900">Incoming Partner Requests</h3>
		<p class="mt-4 text-sm text-gray-500">You can only have one active partner at a time</p>
	</div>
	<div>
		<ul class="divide-y divide-gray-100">
			{#each $requests as request, index}
				<li class="flex justify-between gap-x-6 py-5">
					<div class="flex gap-x-4">
						{#if request.expand.from_user.avatar}
							<img
								class="h-12 w-12 inline-block object-cover flex-none rounded-full bg-gray-50"
								src={getImageURL(
									request.expand.from_user.collectionId,
									request.expand.from_user.id,
									request.expand.from_user.avatar,
									'500x500'
								)}
								alt="Requested user avatar"
							/>
						{:else}
							<svg
								class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 ring-8 ring-white"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
							>
								<path
									fill-rule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z"
									clip-rule="evenodd"
								/>
							</svg>
						{/if}
						<div class="min-w-0 flex-auto">
							<p class="text-sm font-semibold leading-6 text-gray-900">
								{request.expand.from_user?.first_name}
							</p>
							<p class="mt-1 truncate text-xs leading-5 text-gray-500">
								{request.expand.from_user?.username}
							</p>
						</div>
					</div>
					<div class="flex flex-row items-center">
						<button
							on:click={() => acceptRequest(index)}
							type="button"
							class="rounded-md bg-eggplant mr-2 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-carnation-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eggplant"
						>
							Accept
						</button>
						<button
							on:click={() => declineRequest(index)}
							type="button"
							class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
						>
							Decline
						</button>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</div>

<div class="container mt-6 bg-white rounded-2xl mx-auto py-3 sm:px-6 lg:px-8">
	<div class="bg-white px-4 py-5 sm:px-6">
		<h3 class="text-2xl font-semibold leading-6 text-gray-900">Send a Request</h3>
	</div>

	<div class="flex flex-col flex-shrink md:w-9/12 lg:w-1/2">
		{#if form?.success}
			<div class="rounded-md bg-green-50 p-4">
				<div class="flex">
					<div class="flex-shrink-0">
						<svg
							class="h-5 w-5 text-green-400"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
					<div class="ml-3">
						<h3 class="text-sm font-medium text-green-800">Partner Request Sent</h3>
						<div class="mt-2 text-sm text-green-700">
							<p>Have your partner check their partner requests page to accept</p>
						</div>
					</div>
				</div>
			</div>
		{:else if form?.error}
			<div class="rounded-md bg-red-50 p-4">
				<div class="flex">
					<div class="flex-shrink-0">
						<svg
							class="h-5 w-5 text-red-400"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
					<div class="ml-3">
						<h3 class="text-sm font-medium text-red-800">
							There were {form?.errorMessages.length} error(s)
						</h3>
						<div class="mt-2 text-sm text-red-700">
							<ul class="list-disc space-y-1 pl-5">
								{#each form?.errorMessages as message}
									<li>{message}</li>
								{/each}
							</ul>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<form method="POST" action="?/partnerRequest" use:enhance>
			<div class="flex flex-row mt-4">
				<input
					name="username"
					type="text"
					class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-eggplant sm:text-sm sm:leading-6"
				/>
				<button
					type="submit"
					class="rounded-md bg-eggplant ml-2 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-carnation-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eggplant"
				>
					Send
				</button>
			</div>
			<p class="mt-2 text-sm text-gray-500">Enter a username to send a partner request</p>
		</form>
	</div>
</div>
