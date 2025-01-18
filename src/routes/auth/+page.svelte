<script lang="ts">
	import { page } from '$app/stores';
	import { TabGroup, Tab, ProgressBar } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	export let form;
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	let isLoginView = true; // Default view is Login

	onMount(() => {
		$page.url.hash === '#register' && (isLoginView = false);
	});

	//loading state
	let isRegisterLoading = false;

	let isLoginLoading = false;

	const submitRegister = () => {
		isRegisterLoading = true;

		return async ({ update }) => {
			await update();
			isRegisterLoading = false;
			isLoginView = true;
		};
	};

	const submitLogin = () => {
		isLoginLoading = true;

		return async ({ update }) => {
			await update();
			isLoginLoading = false;
		};
	};

	let password = '';
	let passwordError = '';
	let showverify = false;

	$: if (form?.success) {
		showverify = true;
	}

	let verified = false;
	$: if (
		typeof $page.url.searchParams.get('verified') === 'string' &&
		$page.url.searchParams.get('verified')?.toLowerCase() === 'true'
	) {
		verified = true;
	}

	function verifyPasswordLength() {
		if (password.length < 6) {
			passwordError = 'Password must be at least 6 characters long';
		} else {
			passwordError = '';
		}
	}

	// Function to switch the view based on the hash in URL

	function validatePhoneAndTgUsername() {
		const phone = document.querySelector<HTMLInputElement>('[name="phone"]');
		const tg_username = document.querySelector<HTMLInputElement>('[name="tg_username"]');

		if (phone.value.trim() === '' && tg_username.value.trim() === '') {
			phone.setCustomValidity('Please provide either phone or Telegram username');
			phone.reportValidity();
			tg_username.setCustomValidity('Please provide either phone or Telegram username');
			tg_username.reportValidity();
		} else {
			phone.setCustomValidity('');
			tg_username.setCustomValidity('');
		}
	}
</script>

<div class="mx-auto max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg">
	<h2 class="text-center text-2xl font-semibold text-gray-800">
		{isLoginView ? 'Login' : 'Register'}
	</h2>

	<TabGroup>
		<Tab
			bind:group={isLoginView}
			on:click={() => {
				goto('/auth#login');
			}}
			name="tab1"
			value={true}
		>
			<span>Login</span>
		</Tab>
		<Tab
			bind:group={isLoginView}
			on:click={() => {
				goto('/auth#register');
			}}
			name="tab2"
			value={false}>Register</Tab
		>
		<!-- Tab Panels --->
		<svelte:fragment slot="panel">
			{#if isLoginView}
				<!-- Login Form -->
				<form method="POST" action="?/login" class="space-y-6" use:enhance={submitLogin}>
					{#if form?.user_exists}
						<p class="mt-4 text-center font-bold text-red-300">
							You already have an account, please login.
						</p>
					{/if}
					{#if form?.invalid_login}
						<div class="mt-4 rounded-lg border border-red-600 bg-red-200 p-1">
							<p class=" text-center font-bold text-red-500">Invalid login credentials</p>
						</div>
					{/if}
					{#if form?.error_message}
						<div class="mt-4 rounded-lg border border-red-600 bg-red-200 p-1">
							<p class=" text-center font-bold text-red-500">{error_message}</p>
						</div>
					{/if}
					{#if form?.email_not_verified}
						<p class="mt-4 text-center font-bold text-red-300">
							Please verify your email before logging in
						</p>
					{/if}

					{#if showverify}
						<p
							class="mt-4 rounded-md border border-gray-300 bg-slate-100 p-3 text-center font-bold text-gray-600"
						>
							Please verify your email to activate your account and login.
						</p>
					{/if}

					{#if verified}
						<p
							class="mt-4 rounded-md border border-gray-300 bg-slate-100 p-3 text-center font-bold text-gray-600"
						>
							Your Email has been verified. You can now login with your newly created account!
						</p>
					{/if}

					<div class="space-y-2">
						<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
						<input
							name="email"
							type="email"
							placeholder="your@email.com"
							class="w-full rounded-lg border px-4 py-2 text-gray-700 outline-none focus:ring-2 focus:ring-secondary-500"
							required
						/>
					</div>

					<div class="space-y-2">
						<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
						<input
							name="password"
							type="password"
							placeholder="Your password"
							class="w-full rounded-lg border px-4 py-2 text-gray-700 outline-none focus:ring-2 focus:ring-secondary-500"
							required
						/>
					</div>

					<div class="flex flex-col justify-center gap-2">
						{#if isLoginLoading}
							<ProgressBar meter="bg-secondary-600" />
						{/if}
						<button
							disabled={isLoginLoading}
							aria-busy={isLoginLoading}
							type="submit"
							class="w-full rounded-lg bg-secondary-600 py-2 font-medium text-white hover:bg-secondary-700 disabled:bg-gray-300"
						>
							Login
						</button>
						<div class="mt-3 text-center">
							<a href="/auth/reset-password" class="text-secondary-500 hover:underline"
								>Forgot Password?</a
							>
						</div>
					</div>
				</form>
			{:else}
				<!-- Register Form -->
				<form method="POST" action="?/signup" class="space-y-6" use:enhance={submitRegister}>
					<div class="space-y-2">
						<label for="email" class="block text-sm font-medium text-gray-700"
							>Email <label for="email" class="inline text-sm font-medium italic text-gray-500"
								>(required)</label
							>
							<input
								name="email"
								type="email"
								placeholder="your@email.com"
								class="w-full rounded-lg border px-4 py-2 text-gray-700 outline-none focus:ring-2 focus:ring-secondary-500"
								required
							/>
						</label>
					</div>

					<div class="space-y-2">
						<label for="password" class="block text-sm font-medium text-gray-700"
							>Password <label
								for="password"
								class="inline text-sm font-medium italic text-gray-500">(required)</label
							>
							<input
								name="password"
								type="password"
								bind:value={password}
								onchange={verifyPasswordLength}
								placeholder="Your password"
								class="w-full rounded-lg border px-4 py-2 text-gray-700 outline-none focus:ring-2 focus:ring-secondary-500"
								required
							/>
							<p class="text-sm text-red-500">
								{passwordError ? `Password must be at least 6 characters` : ''}
							</p>
						</label>
					</div>

					<div class="space-y-2">
						<label for="name" class="block text-sm font-medium text-gray-700"
							>Name <label for="name" class="inline text-sm font-medium italic text-gray-500"
								>(required)</label
							></label
						>
						<input
							name="name"
							type="text"
							class="w-full rounded-lg border px-4 py-2 text-gray-700 outline-none focus:ring-2 focus:ring-secondary-500"
							placeholder="John Doe"
							required
						/>
					</div>

					<div class="space-y-2">
						<label for="phone" class="block text-sm font-medium text-gray-700">Mobile Number</label>
						<input
							name="phone"
							type="tel"
							class="w-full rounded-lg border px-4 py-2 text-gray-700 outline-none focus:ring-2 focus:ring-secondary-500"
							placeholder="+65XXXXXXXX"
							oninput={validatePhoneAndTgUsername}
						/>
					</div>

					<div class="space-y-2">
						<label for="phone" class="block text-sm font-medium text-gray-700"
							>Telegram Username</label
						>
						<input
							name="tg_username"
							type="tel"
							class="w-full rounded-lg border px-4 py-2 text-gray-700 outline-none focus:ring-2 focus:ring-secondary-500"
							placeholder="Telegram @username"
							oninput={validatePhoneAndTgUsername}
						/>
					</div>

					<div class="flex flex-col justify-center gap-2">
						{#if isRegisterLoading}
							<ProgressBar meter="bg-secondary-600" />
						{/if}
						<button
							aria-busy={isRegisterLoading}
							disabled={isRegisterLoading}
							type="submit"
							class="w-full rounded-lg bg-secondary-600 py-2 font-medium text-white hover:bg-secondary-700 disabled:cursor-not-allowed disabled:bg-gray-300"
						>
							Register
						</button>
					</div>
				</form>
			{/if}
		</svelte:fragment>
	</TabGroup>
</div>
