<script lang="ts">
	import Post from './Post.svelte';
	import type { PageData } from '../../../routes/$types';
	import viewport from '$lib/useViewportAction';
	import { pb, currentUser } from '$lib/pocketbase';
	import { TIMELINE_LOAD_AMOUNT } from '$lib/utils';

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

<div class="flow-root py-6">
	<ul class="-mb-8">
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
