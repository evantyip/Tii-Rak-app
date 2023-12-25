<script lang="ts">
	import '../app.css';
	import { NavMenu } from '$lib/components';
</script>

<div class="flex flex-col min-h-full h-screen">
	<NavMenu />

	<main class="-mt-32 mb-auto">
		<div class="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
			<!-- Your content -->
			<slot />
		</div>
	</main>

	<footer class="bg-white">
		<div class="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
			<div class="mt-8 md:order-1 md:mt-0">
				<p class="text-center text-xs leading-5 text-gray-500">
					&copy; {new Date().getFullYear()} Thirak. All rights reserved.
				</p>
			</div>
		</div>
	</footer>
</div>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.floral-white);
	}
</style>
