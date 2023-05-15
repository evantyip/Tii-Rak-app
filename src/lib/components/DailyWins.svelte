<script lang="ts">
	import { currentUser, pb } from '$lib/pocketbase';
	import { writable } from 'svelte/store';

	let win: string = '';
	let dailyWins = writable<string[]>([]);

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
		} catch (err) {
			console.error(err);
			throw err;
		}
	}
</script>

<div class="container bg-white rounded-2xl mx-auto py-3 sm:px-6 lg:px-8">
	<ul class="space-y-3">
		{#each $dailyWins as win}
			<li
				class="overflow-hidden bg-gray-50 px-4 py-4 shadow whitespace-pre-wrap sm:rounded-md sm:px-6"
			>
				{win}
			</li>
		{/each}
	</ul>

	<form method="POST" action="/daily_wins">
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
								class="block w-full rounded-md border-0 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
							/>
						</div>
						<button
							on:click|preventDefault={handleAdd}
							class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>
							Add
						</button>

						<button
							on:click|preventDefault={handleSave}
							class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>
							Save
						</button>
					</div>
				</div>
			</div>
		</div>
	</form>
</div>
