<script lang="ts">
	import { currentUser } from '$lib/pocketbase';

	export let authorId: string;
	export let date: string;
	export let winsOfTheDay: string[];
	export let lastPost: boolean;
</script>

<!-- Make this a component with props -->
<li>
	<div class="relative pb-8">
		<!-- This span is the line that connects to other below it -->
		{#if !lastPost}
			<span class="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
		{/if}
		<div class="relative flex items-start space-x-3">
			<div class="relative">
				<svg
					class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 ring-8 ring-white"
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

				<!-- TODO: investigate using picture in conditional rednering -->
				<!-- <img
          class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400 ring-8 ring-white"
          src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80"
          alt=""
        />

        <span class="absolute -bottom-0.5 -right-1 rounded-tl bg-white px-0.5 py-px">
          <svg
            class="h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902.848.137 1.705.248 2.57.331v3.443a.75.75 0 001.28.53l3.58-3.579a.78.78 0 01.527-.224 41.202 41.202 0 005.183-.5c1.437-.232 2.43-1.49 2.43-2.903V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0010 2zm0 7a1 1 0 100-2 1 1 0 000 2zM8 8a1 1 0 11-2 0 1 1 0 012 0zm5 1a1 1 0 100-2 1 1 0 000 2z"
              clip-rule="evenodd"
            />
          </svg>
        </span> -->
			</div>
			<div class="min-w-0 flex-1">
				<div>
					<div class="text-sm">
						<!-- This is name -->
						<p class="font-medium text-gray-900">
							{authorId === $currentUser?.id ? 'You' : 'Other'}
						</p>
					</div>
					<!-- Date/time -->
					<p class="mt-0.5 text-sm text-gray-500">{date}</p>
				</div>
				<div class="mt-2 text-sm text-gray-700">
					<!-- Content goes here -->
					<div class="overflow-hidden lg:w-1/2 w-9/12 rounded-md border border-gray-300">
						<ul class="divide-y divide-gray-300">
							{#each winsOfTheDay as win}
								<li class="px-6 py-4">
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
