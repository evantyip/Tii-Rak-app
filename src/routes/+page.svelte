<script lang="ts">
	import { Timeline } from '$lib/components';
	import { currentUser } from '$lib/pocketbase';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="container bg-white rounded-2xl pb-12 mx-auto py-3 sm:px-6 lg:px-8">
	{#if $currentUser}
		<Timeline {data} />
	{:else}
		<h1>Should be a landing info section</h1>
	{/if}
</div>
