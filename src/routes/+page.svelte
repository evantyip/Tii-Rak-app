<script lang="ts">
	import { Timeline, Landing } from '$lib/components';
	import { currentUser } from '$lib/pocketbase';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex justify-center pb-12 mx-auto py-3 sm:px-6 lg:px-8">
	{#if $currentUser}
		<Timeline {data} />
	{:else}
		<Landing />
	{/if}
</div>
