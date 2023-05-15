<script lang="ts">
	import Post from './Post.svelte';
	import type { PageData } from '../../../routes/$types';

	export let data: PageData;

	// TODO figure out better math for this
	let lastIndex = data.wins.items.length - 1;
</script>

<div class="flow-root py-6">
	<ul class="-mb-8">
		{#each data.wins.items as day, index}
			<Post
				authorId={day.user}
				date={day.created}
				winsOfTheDay={day.wins.data}
				lastPost={index === lastIndex}
			/>
		{/each}
	</ul>
</div>
