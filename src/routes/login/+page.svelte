<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { pb } from '$lib/pocketbase';
	import { Error } from '$lib/components';
	import { superForm } from 'sveltekit-superforms/client';
	import { GoogleLoginButton } from '$lib/components';
	import type { PageData } from './$types';

	export let data: PageData;

	const { form, errors, message } = superForm(data.form);
	let loading: boolean = false;

	function loginEnhance() {
		return async ({ result }: { result: any }) => {
			loading = true;

			pb.authStore.loadFromCookie(document.cookie);
			await applyAction(result);

			loading = false;
		};
	}

	async function googleOAuthSignIn() {
		try {
			let w = window.open() as Window;
			await pb.collection('users').authWithOAuth2({
				provider: 'google',
				urlCallback: (url) => {
					w.location.href = url;
				}
			});
			goto('/');
		} catch (err) {
			console.error(err);
		}
	}
</script>

<div class="flex min-h-full rounded-2xl flex-col justify-center py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<h2 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
			Sign in to your account
		</h2>
	</div>

	<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
		<div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
			{#if $message?.type === 'error'}
				<div class="pb-6">
					<Error mainMessage={$message?.text} />
				</div>
			{/if}
			{#if $errors?.email}
				<div class="pb-6">
					<Error mainMessage={String($errors?.email)} />
				</div>
			{/if}
			{#if $errors?.password}
				<div class="pb-6">
					<Error mainMessage={String($errors?.password)} />
				</div>
			{/if}
			<form class="space-y-6" method="POST" use:enhance={loginEnhance}>
				<div>
					<label for="email" class="block text-sm font-medium leading-6 text-gray-900"
						>Email address</label
					>
					<div class="mt-2">
						<input
							id="email"
							name="email"
							bind:value={$form.email}
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
							autocomplete="current-password"
							bind:value={$form.password}
							class="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-eggplant sm:text-sm sm:leading-6"
							disabled={loading}
						/>
					</div>
				</div>

				<div class="flex items-center justify-between">
					<div class="flex items-center">
						<input
							id="remember-me"
							name="remember-me"
							type="checkbox"
							class="h-4 w-4 rounded border-gray-300 text-eggplant focus:ring-eggplant"
							disabled={loading}
						/>
						<label for="remember-me" class="ml-3 block text-sm leading-6 text-gray-900"
							>Remember me</label
						>
					</div>

					<div class="text-sm leading-6">
						<a href="#" class="font-semibold text-eggplant hover:text-carnation-pink"
							>Forgot password?</a
						>
					</div>
				</div>

				<div>
					<button
						type="submit"
						class="flex w-full justify-center rounded-md bg-eggplant px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-carnation-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eggplant"
						disabled={loading}
					>
						Sign in
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
					<GoogleLoginButton {googleOAuthSignIn} />
				</div>
			</div>

			<p class="mt-10 text-center text-sm text-gray-500">
				Don't an account?
				<a href="/register" class="font-semibold leading-6 text-eggplant hover:text-carnation-pink"
					>Register</a
				>
			</p>
		</div>
	</div>
</div>
