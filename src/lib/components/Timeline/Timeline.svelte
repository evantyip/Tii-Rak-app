<script lang="ts">
	import Post from './Post.svelte';
	import type { PageData } from '../../../routes/$types';
	import viewport from '$lib/useViewportAction';
	import { pb, currentUser } from '$lib/pocketbase';
	import { TIMELINE_LOAD_AMOUNT } from '$lib/utils';
	import { goto } from '$app/navigation';

	export let data: PageData;
	let page: number = data.wins.page;
	let listData: Array<any> = data.wins.items;
	let loading: boolean = false;
	let noMoreData: boolean = false;

	let lastIndex = data.wins.totalItems - 1;

	async function loadData() {
		loading = true;
		page += 1;
		const resultList = structuredClone(
			await pb.collection('daily_wins').getList(page, TIMELINE_LOAD_AMOUNT, {
				fitler: `user = "${$currentUser?.id}" || user = "${$currentUser?.partner}"`,
				sort: '-created',
				expand: 'user'
			})
		);
		listData = listData.concat(resultList.items);

		if (listData.length >= resultList.totalItems) {
			noMoreData = true;
		}

		loading = false;
	}
</script>

<div class="flex justify-center items-center md:w-3/4 py-6">
	<ul class="-mb-8">
		<li>
			<div class="relative pb-8">
				<span class="absolute left-6 top-5 -ml-px h-full w-0.5 bg-olivine" aria-hidden="true" />
				<div class="relative flex items-start space-x-3">
					<div class="relative">
						<button
							on:click|preventDefault={() => goto('/wins')}
							class="flex h-12 w-12 p-2 items-center justify-center rounded-full bg-eggplant text-white shadow-lg hover:bg-carnation-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eggplant"
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
		</li>
		{#each listData as day, index}
			<Post
				authorId={day.user}
				authorName={day.expand.user.first_name}
				authorAvatar={day.expand.user.avatar}
				authorCollectionId={day.expand.user.collectionId}
				date={day.created}
				winsOfTheDay={day.wins.data}
				lastPost={index === lastIndex}
			/>
		{/each}
		{#if !noMoreData && data.wins.totalItems > TIMELINE_LOAD_AMOUNT}
			<li use:viewport on:enterViewport={() => loadData()}>
				{#if loading}
					Loading ...
				{/if}
			</li>
		{/if}
	</ul>
</div>
