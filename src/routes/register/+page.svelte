<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Error } from '$lib/components';
	import { pb } from '$lib/pocketbase';
	import type { ActionData } from './$types';

	export let form: ActionData;
	let loading: boolean = false;

	function registerEnhance() {
		return async ({ result }: { result: any }) => {
			loading = true;

			pb.authStore.loadFromCookie(document.cookie);
			await applyAction(result);

			loading = false;
		};
	}

	async function googleOAuthSignIn() {
		try {
			await pb.collection('users').authWithOAuth2({ provider: 'google' });
			goto('/');
		} catch (err) {
			console.error(err);
		}
	}
</script>

<div class="flex min-h-full rounded-2xl flex-col justify-center py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<h2 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
			Register your account
		</h2>
	</div>

	<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
		<div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
			{#if form?.error && form?.errorMessages.length === 1}
				<div class="pb-6">
					<Error mainMessage={form?.errorMessages[0]} />
				</div>
			{:else if form?.error && form?.errorMessages.length > 1}
				<div class="pb-6">
					<Error mainMessage="Invalid Registration" messages={form?.errorMessages} />
				</div>
			{/if}
			<form class="space-y-6" method="POST" use:enhance={registerEnhance}>
				<div>
					<label for="email" class="block text-sm font-medium leading-6 text-gray-900"
						>Email address</label
					>
					<div class="mt-2">
						<input
							id="email"
							name="email"
							type="email"
							required
							class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-eggplant sm:text-sm sm:leading-6"
							disabled={loading}
						/>
					</div>
				</div>

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
					<label for="first_name" class="block text-sm font-medium leading-6 text-gray-900"
						>First Name</label
					>
					<div class="mt-2">
						<input
							id="first_name"
							name="first_name"
							type="first_name"
							required
							class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-eggplant sm:text-sm sm:leading-6"
							disabled={loading}
						/>
					</div>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium leading-6 text-gray-900"
						>Password</label
					>
					<div class="mt-2">
						<input
							id="password"
							name="password"
							type="password"
							required
							class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-eggplant sm:text-sm sm:leading-6"
							disabled={loading}
						/>
					</div>
				</div>

				<div>
					<label for="passwordConfirm" class="block text-sm font-medium leading-6 text-gray-900"
						>Password Confirm</label
					>
					<div class="mt-2">
						<input
							id="passwordConfirm"
							name="passwordConfirm"
							type="password"
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
						disabled={loading}
					>
						Register
					</button>
				</div>
			</form>

			<div>
				<div class="relative mt-10">
					<div class="absolute inset-0 flex items-center" aria-hidden="true">
						<div class="w-full border-t border-gray-200" />
					</div>
					<div class="relative flex justify-center text-sm font-medium leading-6">
						<span class="bg-white px-6 text-gray-900">Or continue with</span>
					</div>
				</div>

				<div class="mt-6 flex gap-4">
					<button
						on:click={googleOAuthSignIn}
						class="flex w-full items-center justify-center gap-3 rounded-md bg-[#4285F4] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D9BF0]"
					>
						<svg
							class="h-7 w-7"
							viewBox="0 0 46 46"
							version="1.1"
							xmlns="http://www.w3.org/2000/svg"
							xmlns:xlink="http://www.w3.org/1999/xlink"
						>
							<!-- Generator: Sketch 3.3.3 (12081) - http://www.bohemiancoding.com/sketch -->
							<title>btn_google_light_normal_ios</title>
							<desc>Created with Sketch.</desc>
							<defs>
								<filter
									x="-50%"
									y="-50%"
									width="200%"
									height="200%"
									filterUnits="objectBoundingBox"
									id="filter-1"
								>
									<feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1" />
									<feGaussianBlur
										stdDeviation="0.5"
										in="shadowOffsetOuter1"
										result="shadowBlurOuter1"
									/>
									<feColorMatrix
										values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.168 0"
										in="shadowBlurOuter1"
										type="matrix"
										result="shadowMatrixOuter1"
									/>
									<feOffset dx="0" dy="0" in="SourceAlpha" result="shadowOffsetOuter2" />
									<feGaussianBlur
										stdDeviation="0.5"
										in="shadowOffsetOuter2"
										result="shadowBlurOuter2"
									/>
									<feColorMatrix
										values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.084 0"
										in="shadowBlurOuter2"
										type="matrix"
										result="shadowMatrixOuter2"
									/>
									<feMerge>
										<feMergeNode in="shadowMatrixOuter1" />
										<feMergeNode in="shadowMatrixOuter2" />
										<feMergeNode in="SourceGraphic" />
									</feMerge>
								</filter>
								<rect id="path-2" x="0" y="0" width="40" height="40" rx="2" />
							</defs>
							<g id="Google-Button" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
								<g id="9-PATCH" transform="translate(-608.000000, -160.000000)" />
								<g id="btn_google_light_normal" transform="translate(-1.000000, -1.000000)">
									<g id="button" transform="translate(4.000000, 4.000000)" filter="url(#filter-1)">
										<g id="button-bg">
											<use fill="#FFFFFF" fill-rule="evenodd" xlink:href="#path-2" />
											<use fill="none" xlink:href="#path-2" />
											<use fill="none" xlink:href="#path-2" />
											<use fill="none" xlink:href="#path-2" />
										</g>
									</g>
									<g id="logo_googleg_48dp" transform="translate(15.000000, 15.000000)">
										<path
											d="M17.64,9.20454545 C17.64,8.56636364 17.5827273,7.95272727 17.4763636,7.36363636 L9,7.36363636 L9,10.845 L13.8436364,10.845 C13.635,11.97 13.0009091,12.9231818 12.0477273,13.5613636 L12.0477273,15.8195455 L14.9563636,15.8195455 C16.6581818,14.2527273 17.64,11.9454545 17.64,9.20454545 L17.64,9.20454545 Z"
											id="Shape"
											fill="#4285F4"
										/>
										<path
											d="M9,18 C11.43,18 13.4672727,17.1940909 14.9563636,15.8195455 L12.0477273,13.5613636 C11.2418182,14.1013636 10.2109091,14.4204545 9,14.4204545 C6.65590909,14.4204545 4.67181818,12.8372727 3.96409091,10.71 L0.957272727,10.71 L0.957272727,13.0418182 C2.43818182,15.9831818 5.48181818,18 9,18 L9,18 Z"
											id="Shape"
											fill="#34A853"
										/>
										<path
											d="M3.96409091,10.71 C3.78409091,10.17 3.68181818,9.59318182 3.68181818,9 C3.68181818,8.40681818 3.78409091,7.83 3.96409091,7.29 L3.96409091,4.95818182 L0.957272727,4.95818182 C0.347727273,6.17318182 0,7.54772727 0,9 C0,10.4522727 0.347727273,11.8268182 0.957272727,13.0418182 L3.96409091,10.71 L3.96409091,10.71 Z"
											id="Shape"
											fill="#FBBC05"
										/>
										<path
											d="M9,3.57954545 C10.3213636,3.57954545 11.5077273,4.03363636 12.4404545,4.92545455 L15.0218182,2.34409091 C13.4631818,0.891818182 11.4259091,0 9,0 C5.48181818,0 2.43818182,2.01681818 0.957272727,4.95818182 L3.96409091,7.29 C4.67181818,5.16272727 6.65590909,3.57954545 9,3.57954545 L9,3.57954545 Z"
											id="Shape"
											fill="#EA4335"
										/>
										<path d="M0,0 L18,0 L18,18 L0,18 L0,0 Z" id="Shape" />
									</g>
									<g id="handles_square" />
								</g>
							</g>
						</svg>

						<span class="text-sm font-semibold leading-6">Google</span>
					</button>
				</div>

				<p class="mt-10 text-center text-sm text-gray-500">
					Already signed up?
					<a href="/login" class="font-semibold leading-6 text-eggplant hover:text-carnation-pink">
						Login
					</a>
				</p>
			</div>
		</div>
	</div>
</div>
