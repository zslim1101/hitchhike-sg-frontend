<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Car, User, Mail, Lock, Phone, MessageSquare, Loader2 } from 'lucide-svelte';

	export let form; // Properly export the form prop

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

	function validatePhoneAndTgUsername() {
		const phone = document.querySelector<HTMLInputElement>('[name="phone"]');
		const tg_username = document.querySelector<HTMLInputElement>('[name="tg_username"]');

		if (phone && tg_username && phone.value.trim() === '' && tg_username.value.trim() === '') {
			phone.setCustomValidity('Please provide either phone or Telegram username');
			phone.reportValidity();
			tg_username.setCustomValidity('Please provide either phone or Telegram username');
			tg_username.reportValidity();
		} else if (phone && tg_username) {
			phone.setCustomValidity('');
			tg_username.setCustomValidity('');
		}
	}
</script>

<div class="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12">
	<div class="mx-auto max-w-md">
		<!-- Logo and Brand -->
		<div class="mb-8 text-center">
			<div class="mb-2 flex justify-center">
				<div class="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 p-3">
					<Car class="h-8 w-8 text-amber-600" />
				</div>
			</div>
			<h1 class="text-3xl font-bold text-gray-800">CarPool Asia</h1>
			<p class="text-gray-600">Find your perfect ride companion</p>
		</div>

		<!-- Auth Card -->
		<div class="overflow-hidden rounded-xl bg-white shadow-lg">
			<!-- Tab Navigation -->
			<div class="grid grid-cols-2 border-b">
				<button
					class={`py-4 text-center font-medium transition ${
						isLoginView
							? 'border-b-2 border-amber-500 bg-amber-50 text-amber-700'
							: 'text-gray-500 hover:bg-gray-50'
					}`}
					on:click={() => {
						isLoginView = true;
						goto('/auth#login');
					}}
				>
					Login
				</button>
				<button
					class={`py-4 text-center font-medium transition ${
						!isLoginView
							? 'border-b-2 border-amber-500 bg-amber-50 text-amber-700'
							: 'text-gray-500 hover:bg-gray-50'
					}`}
					on:click={() => {
						isLoginView = false;
						goto('/auth#register');
					}}
				>
					Register
				</button>
			</div>

			<!-- Form Container -->
			<div class="p-8">
				{#if isLoginView}
					<!-- Login Form -->
					<form method="POST" action="?/login" class="space-y-6" use:enhance={submitLogin}>
						<!-- Notification Area -->
						{#if form?.user_exists}
							<div class="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-700">
								<p class="text-center font-medium">
									You already have an account, please login.
								</p>
							</div>
						{/if}
						{#if form?.invalid_login}
							<div class="rounded-lg border border-red-200 bg-red-50 p-3 text-red-600">
								<p class="text-center font-medium">Invalid login credentials</p>
							</div>
						{/if}
						{#if form?.error_message}
							<div class="rounded-lg border border-red-200 bg-red-50 p-3 text-red-600">
								<p class="text-center font-medium">{form.error_message}</p>
							</div>
						{/if}
						{#if form?.email_not_verified}
							<div class="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-700">
								<p class="text-center font-medium">
									Please verify your email before logging in
								</p>
							</div>
						{/if}
						{#if verified}
							<div class="rounded-lg border border-green-200 bg-green-50 p-3 text-green-700">
								<p class="text-center font-medium">
									Your email has been verified. You can now login!
								</p>
							</div>
						{/if}

						<!-- Email Field -->
						<div class="space-y-2">
							<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
							<div class="relative">
								<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<Mail class="h-5 w-5 text-gray-400" />
								</div>
								<input
									name="email"
									type="email"
									placeholder="your@email.com"
									class="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 text-gray-700 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
									required
								/>
							</div>
						</div>

						<!-- Password Field -->
						<div class="space-y-2">
							<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
							<div class="relative">
								<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<Lock class="h-5 w-5 text-gray-400" />
								</div>
								<input
									name="password"
									type="password"
									placeholder="Your password"
									class="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 text-gray-700 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
									required
								/>
							</div>
						</div>

						<!-- Login Button -->
						<div class="pt-2">
							<button
								disabled={isLoginLoading}
								type="submit"
								class="relative w-full rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 py-3 font-medium text-white shadow-md transition hover:from-amber-600 hover:to-yellow-600 disabled:from-gray-300 disabled:to-gray-400"
							>
								{#if isLoginLoading}
									<div class="absolute inset-0 flex items-center justify-center">
										<Loader2 class="h-5 w-5 animate-spin text-white" />
									</div>
									<span class="opacity-0">Login</span>
								{:else}
									Login
								{/if}
							</button>
						</div>

						<!-- Forgot Password -->
						<div class="text-center">
							<a
								href="/auth/reset-password"
								class="text-sm font-medium text-amber-600 hover:text-amber-700 hover:underline"
								>Forgot your password?</a
							>
						</div>
					</form>
				{:else}
					<!-- Register Form -->
					<form method="POST" action="?/signup" class="space-y-6" use:enhance={submitRegister}>
						<!-- Email Field -->
						<div class="space-y-2">
							<label for="email" class="block text-sm font-medium text-gray-700">
								Email <span class="text-sm font-normal text-gray-500">(required)</span>
							</label>
							<div class="relative">
								<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<Mail class="h-5 w-5 text-gray-400" />
								</div>
								<input
									name="email"
									type="email"
									placeholder="your@email.com"
									class="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 text-gray-700 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
									required
								/>
							</div>
						</div>

						<!-- Password Field -->
						<div class="space-y-2">
							<label for="password" class="block text-sm font-medium text-gray-700">
								Password <span class="text-sm font-normal text-gray-500">(required)</span>
							</label>
							<div class="relative">
								<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<Lock class="h-5 w-5 text-gray-400" />
								</div>
								<input
									name="password"
									type="password"
									bind:value={password}
									on:input={verifyPasswordLength}
									placeholder="Your password"
									class="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 text-gray-700 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
									required
								/>
							</div>
							{#if passwordError}
								<p class="text-sm text-red-500">Password must be at least 6 characters</p>
							{/if}
						</div>

						<!-- Name Field -->
						<div class="space-y-2">
							<label for="name" class="block text-sm font-medium text-gray-700">
								Name <span class="text-sm font-normal text-gray-500">(required)</span>
							</label>
							<div class="relative">
								<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<User class="h-5 w-5 text-gray-400" />
								</div>
								<input
									name="name"
									type="text"
									placeholder="John Doe"
									class="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 text-gray-700 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
									required
								/>
							</div>
						</div>

						<!-- Phone Field -->
						<div class="space-y-2">
							<label for="phone" class="block text-sm font-medium text-gray-700">
								Mobile Number
							</label>
							<div class="relative">
								<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<Phone class="h-5 w-5 text-gray-400" />
								</div>
								<input
									name="phone"
									type="tel"
									placeholder="+65XXXXXXXX"
									class="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 text-gray-700 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
									on:input={validatePhoneAndTgUsername}
								/>
							</div>
						</div>

						<!-- Telegram Username Field -->
						<div class="space-y-2">
							<label for="tg_username" class="block text-sm font-medium text-gray-700">
								Telegram Username
							</label>
							<div class="relative">
								<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<MessageSquare class="h-5 w-5 text-gray-400" />
								</div>
								<input
									name="tg_username"
									type="text"
									placeholder="Telegram @username"
									class="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 text-gray-700 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
									on:input={validatePhoneAndTgUsername}
								/>
							</div>
							<p class="text-xs text-gray-500">
								Please provide either a mobile number or Telegram username for contact
							</p>
						</div>

						<!-- Register Button -->
						<div class="pt-2">
							<button
								disabled={isRegisterLoading}
								type="submit"
								class="relative w-full rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 py-3 font-medium text-white shadow-md transition hover:from-amber-600 hover:to-yellow-600 disabled:from-gray-300 disabled:to-gray-400"
							>
								{#if isRegisterLoading}
									<div class="absolute inset-0 flex items-center justify-center">
										<Loader2 class="h-5 w-5 animate-spin text-white" />
									</div>
									<span class="opacity-0">Register</span>
								{:else}
									Register
								{/if}
							</button>
						</div>
					</form>
				{/if}
			</div>
		</div>

		<!-- Footer -->
		<div class="mt-6 text-center text-sm text-gray-500">
			<p>© {new Date().getFullYear()} CarPool Asia. Find your ride anywhere in Asia.</p>
		</div>
	</div>
</div>