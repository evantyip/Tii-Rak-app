<script lang="ts">
	import { goto } from '$app/navigation';
	import { currentUser, pb } from '$lib/pocketbase';
	import { getImageURL } from '$lib/utils';
	import { writable } from 'svelte/store';

	let win: string = '';
	let date = new Date();
	let dailyWins = writable<string[]>([]);
	const formattedDate = new Date(date).toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	});

	function handleDelete(index: number) {
		dailyWins.update((wins) => wins.filter((_, i) => i !== index));
	}

	function handleTextareaKeydown(event: any) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleAdd();
		}
	}

	function handleAdd() {
		if (win.trim() === '') {
			win = '';
			return;
		}

		dailyWins.update((wins) => [...wins, win]);
		win = '';
	}

	async function handleSave() {
		try {
			await pb.collection('daily_wins').create({
				wins: {
					data: $dailyWins
				},
				user: $currentUser?.id
			});
			dailyWins.set([]);
			goto('/');
		} catch (err) {
			console.error(err);
			throw err;
		}
	}
</script>

<div class="flex flex-col justify-center items-center pb-12 mx-auto py-3 sm:px-6 lg:px-8 relative">
	<div class="flex justify-center items-center md:w-3/4 py-6 max-sm:mt-4">
		<ul class="-mb-8 md:w-3/5">
			<li>
				<div class="relative flex items-start space-x-3">
					<div class="relative">
						{#if $currentUser?.avatar}
							<img
								class="flex h-8 w-8 md:h-16 md:w-16 object-cover items-center justify-center rounded-full bg-gray-400 ring-4 ring-olivine"
								src={getImageURL(
									$currentUser?.collectionId,
									$currentUser?.id,
									$currentUser.avatar,
									'500x500'
								)}
								alt="user avatar"
							/>
						{:else}
							<svg
								class="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 ring-4 ring-olivine"
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
					</div>
					<div class="min-w-1/2 flex-1">
						<div>
							<div class="text-sm">
								<p class="font-medium text-gray-900">You</p>
							</div>
							<p class="mt-0.5 text-sm text-gray-500">{formattedDate}</p>
						</div>
						<div class="mt-2 text-sm text-gray-700">
							<div class="rounded-md border border-gray-300">
								<ul class="divide-y divide-gray-300">
									{#each $dailyWins as win, index}
										<li class="flex flex-row p-4 justify-between gap-x-6">
											<div class="flex gap-x-4">
												<div class="flex-auto whitespace-pre-wrap">
													{win}
												</div>
											</div>
											<div class="flex flex-row items-center">
												<button
													type="button"
													class="rounded-md bg-eggplant px-2 py-1 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-carnation-pink"
													on:click={() => handleDelete(index)}
												>
													x
												</button>
											</div>
										</li>
									{/each}
								</ul>
							</div>
						</div>
					</div>
				</div>
			</li>
		</ul>
	</div>

	<div class="flex justify-center items-center relative mt-4 pr-4 md:w-2/5 md:mt-10 md:ml-14">
		<div class="w-full mt-2 mb-2 static">
			<textarea
				bind:value={win}
				rows="3"
				class="block bg-transparent rounded-md resize-none w-full border-0 text-gray-900 shadow-lg ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-eggplant sm:text-sm sm:leading-6"
				placeholder="Write a small win for the day. Example: I went rock climbing with my friends"
				on:keydown={handleTextareaKeydown}
			/>
			<button
				on:click|preventDefault={handleAdd}
				class="rounded-full bg-eggplant p-2 absolute bottom-0 right-0 text-white shadow-sm hover:bg-carnation-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eggplant"
			>
				<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
					<path
						d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
					/>
				</svg>
			</button>
		</div>
	</div>

	{#if $dailyWins.length > 0}
		<button
			on:click|preventDefault={handleSave}
			class="absolute top-0 rounded-md bg-eggplant px-4 py-2 sm:right-36 md:right-48 lg:right-56 xl:right-64 text-sm font-semibold text-white shadow-sm hover:bg-carnation-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eggplant"
		>
			Post
		</button>
	{/if}
</div>
