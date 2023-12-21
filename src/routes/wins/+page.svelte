<script lang="ts">
	import { goto } from '$app/navigation';
	import { currentUser, pb } from '$lib/pocketbase';
	import { writable } from 'svelte/store';

	let win: string = '';
	let date = new Date();
	let dailyWins = writable<string[]>([]);

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

<div class="container bg-white rounded-2xl mx-auto py-3 sm:px-6 lg:px-8">
	<div class="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
		<h3 class="text-2xl font-semibold leading-6 text-gray-900">
			{date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
		</h3>
	</div>
	<div>
		<ul class="divide-y divide-gray-200">
			{#each $dailyWins as win, index}
				<li class="flex flex-row p-4 justify-between gap-x-6">
					<div class="flex gap-x-4">
						<div class="min-w-0 flex-auto whitespace-pre-wrap">
							{win}
						</div>
					</div>
					<div class="flex flex-row items-center">
						<button
							type="button"
							class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-500"
							on:click={() => handleDelete(index)}
						>
							Delete
						</button>
					</div>
				</li>
			{/each}
		</ul>
	</div>
	{#if $dailyWins.length > 0}
		<div class="border-t border-gray-200 bg-white px-4 py-5 sm:px-6">
			<button
				on:click|preventDefault={handleSave}
				class="rounded-md mt-4 bg-eggplant px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-carnation-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eggplant"
			>
				Save Wins
			</button>
		</div>
	{/if}
	<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
		<div class="col-span-full">
			<label for="about" class="block text-sm font-medium leading-6 text-gray-900">
				Write a small win for the day. Example: I went rock climbing with my friends at night
			</label>
			<div class="mt-2 mb-2">
				<textarea
					bind:value={win}
					name="about"
					rows="3"
					class="block w-full rounded-md border-0 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-eggplant sm:text-sm sm:leading-6"
					on:keydown={handleTextareaKeydown}
				/>
			</div>
			<button
				on:click|preventDefault={handleAdd}
				class="rounded-full bg-eggplant p-2 text-white shadow-sm hover:bg-carnation-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eggplant"
			>
				<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
					<path
						d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
					/>
				</svg>
			</button>
		</div>
	</div>
</div>
<!-- <div class="container mt-2 bg-white rounded-2xl mx-auto py-3 sm:px-6 lg:px-8">
	<div class="space-y-12">
		<div class="bordepb-12">
			<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
				<div class="col-span-full">
					<label for="about" class="block text-sm font-medium leading-6 text-gray-900">
						Write a small win for the day. Example: I went rock climbing with my friends at night
					</label>
					<div class="mt-2 mb-2">
						<textarea
							bind:value={win}
							name="about"
							rows="3"
							class="block w-full rounded-md border-0 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-eggplant sm:text-sm sm:leading-6"
							on:keydown={handleTextareaKeydown}
						/>
					</div>
					<button
						on:click|preventDefault={handleAdd}
						class="rounded-full bg-eggplant p-2 text-white shadow-sm hover:bg-carnation-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eggplant"
					>
						<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
							<path
								d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	</div>
</div> -->
