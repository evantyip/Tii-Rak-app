<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { pb } from '$lib/pocketbase';
	import { Error } from '$lib/components';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let loading: boolean;
	$: loading = false;

	function setupEnhance() {
		return async ({ result, update }: { result: any; update: any }) => {
			loading = true;
			switch (result.type) {
				case 'failure':
					await update({ reset: false });
					break;
				case 'redirect':
					pb.authStore.loadFromCookie(document.cookie);
					goto(result.location);
					break;
			}
			loading = false;
		};
	}
</script>

<div class="flex min-h-full rounded-2xl flex-col justify-center py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<h2 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
			Welcome to Thirak
		</h2>
		<h2 class="text-center text-base leading-9 tracking-tight text-gray-500">
			Finish account setup
		</h2>
	</div>

	<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
		<div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
			{#if form?.error && form?.errorMessages.length === 1}
				<Error mainMessage={form?.errorMessages[0]} />
			{:else if form?.error && form?.errorMessages.length > 1}
				<Error mainMessage="Something went wrong" messages={form?.errorMessages} />
			{/if}
			<form class="space-y-6" method="POST" use:enhance={setupEnhance}>
				<div>
					<label for="username" class="block text-sm font-medium leading-6 text-gray-900"
						>Username</label
					>
					<div class="mt-2">
						<input
							id="username"
							name="username"
							type="username"
							required
							class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-eggplant sm:text-sm sm:leading-6"
							disabled={loading}
						/>
					</div>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium leading-6 text-gray-900"
						>First Name</label
					>
					<div class="mt-2">
						<input
							id="first_name"
							name="first_name"
							type="text"
							required
							class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-eggplant sm:text-sm sm:leading-6"
							disabled={loading}
						/>
					</div>
				</div>

				<div>
					<button
						type="submit"
						class="flex w-full justify-center rounded-md bg-eggplant px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-carnation-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eggplant"
					>
						Finish
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
