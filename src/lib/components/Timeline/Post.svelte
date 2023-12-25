<script lang="ts">
	import { currentUser } from '$lib/pocketbase';
	import { getImageURL } from '$lib/utils';

	export let authorId: string;
	export let authorAvatar: string;
	export let authorCollectionId: string;
	export let authorName: string;
	export let date: string;
	export let winsOfTheDay: string[];
	export let lastPost: boolean;

	const formattedDate = new Date(date).toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	});
</script>

<li>
	<div class="relative pb-8">
		<!-- This span is the line that connects to other below it -->
		{#if !lastPost}
			<span class="absolute left-6 top-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
		{/if}
		<div class="relative flex items-start space-x-3">
			<div class="relative">
				{#if authorAvatar}
					<img
						class="flex h-10 w-10 md:h-16 md:w-16 object-cover items-center justify-center rounded-full bg-gray-400 ring-4 ring-olivine"
						src={getImageURL(authorCollectionId, authorId, authorAvatar, '500x500')}
						alt="user avatar"
					/>
				{:else}
					<svg
						class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 ring-4 ring-olivine"
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
			<div class="min-w-0 flex-1">
				<div>
					<div class="text-sm">
						<!-- This is name -->
						<p class="font-medium text-gray-900">
							{authorId === $currentUser?.id ? 'You' : authorName}
						</p>
					</div>
					<!-- Date/time -->
					<p class="mt-0.5 text-sm text-gray-500">{formattedDate}</p>
				</div>
				<div class="mt-2 text-sm text-gray-700">
					<!-- Content goes here -->
					<div class="overflow-hidden rounded-md border border-gray-300">
						<ul class="divide-y divide-gray-300">
							{#each winsOfTheDay as win}
								<li class="px-6 py-4 whitespace-pre-wrap">
									{win}
								</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</li>
