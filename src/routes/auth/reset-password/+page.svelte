<script lang="ts">
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ supabase, session } = data);

	let loading = false;
	let email = '';
	let token = '';
	let successMessage = '';
	let errorMessage = '';

	let newPassword = '';
	let confirmPassword = '';

	const handleChangePassword = async () => {
		if (newPassword !== confirmPassword) {
			errorMessage = 'Passwords do not match';
			return;
		}

		const { error } = await supabase.auth.updateUser({ password: newPassword });
		if (error) {
			errorMessage = error.message;
		} else {
			errorMessage = '';
			successMessage = 'Password updated successfully';
			step = 4;
		}
	};

	let step = 1;

	const handleResetPass = async () => {
		if (!email || email === '') {
			errorMessage = 'Please enter email';
			return;
		}
		errorMessage = '';
		loading = true;

		const { error } = await supabase.auth.resetPasswordForEmail(email);
		if (error) {
			errorMessage = error.message;
		} else {
			step = 2;
			successMessage = 'OTP has been sent to your email!';
		}

		loading = false;
	};

	const handleSendToken = async () => {
		loading = true;
		const { error } = await supabase.auth.verifyOtp({ email, token, type: 'recovery' });
		if (!error) {
			step = 3;
			// goto('/account/update-password');
		} else {
			errorMessage = error.message;
		}
		loading = false;
	};
</script>

<svelte:head>
	<title>Forgot Password | Carpool Asia</title>
</svelte:head>

<div class="flex h-screen w-full items-center justify-center">
	<div class=" flex flex-col items-center justify-center rounded-xl bg-white p-5 px-5 sm:px-10">
		<h1 class="text-2xl font-bold">Account Recovery</h1>
		<h1 class="mb-7 text-sm font-bold text-gray-300">Reset your password</h1>
		<p class="mb-6 text-center text-lg font-bold">
			{#if step === 1}
				Step 1: Enter Email
			{:else if step === 2}
				Step 2: Enter OTP
			{:else}
				Step 3: Change Password
			{/if}
		</p>
		<form>
			{#if step === 1}
				<div class="mb-4 w-full max-w-lg">
					<label for="email" class="mb-1 block font-semibold">Your Email</label>
					<input
						type="email"
						bind:value={email}
						placeholder="example@email.com"
						class="w-full rounded-lg border border-gray-300 px-4 py-2"
					/>
				</div>
			{/if}

			{#if step === 2}
				<p class="mt-2 rounded-lg bg-green-100 p-3 text-sm font-bold text-green-800">
					{successMessage}
				</p>
				<label for="token" class="mb-1 mt-4 block">Your OTP</label>
				<input
					type="text"
					bind:value={token}
					placeholder="XXXXXX"
					class="w-full rounded-lg border border-gray-300 px-4 py-2"
				/>
			{/if}

			{#if errorMessage !== ''}
				<p class="mt-2 rounded-lg border border-red-500 p-3 text-sm font-bold text-red-800">
					{errorMessage}
				</p>
			{/if}

			{#if step === 1}
				<div class="pt-10">
					<button
						disabled={loading}
						on:click={handleResetPass}
						class="w-full rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-200"
					>
						Send OTP
					</button>
				</div>
				<div class="pt-3">
					<a href="/auth" class="text-xs text-blue-500 hover:underline">Remembered your password?</a
					>
				</div>
			{:else if step === 2}
				<div class="pt-10">
					<button
						disabled={loading}
						on:click={handleSendToken}
						class="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
					>
						Verify OTP
					</button>
					{#if errorMessage !== ''}
						<button
							on:click={() => {
								errorMessage = '';
								email = '';
								successMessage = '';
								step = 1;
							}}
							class="ml-2 rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
						>
							Re-enter Email
						</button>
					{/if}
				</div>
				<div class="pt-3">
					<a href="/auth" class="text-xs text-blue-500 hover:underline">Remembered your password?</a
					>
				</div>
			{/if}

			{#if step === 3}
				<div class="mb-4 w-full max-w-lg">
					<label for="newPassword" class="mb-1 block font-semibold">New Password</label>
					<input
						type="password"
						bind:value={newPassword}
						placeholder="Enter new password"
						class="w-full rounded-lg border border-gray-300 px-4 py-2"
					/>
				</div>
				<div class="mb-4 w-full max-w-lg">
					<label for="confirmPassword" class="mb-1 block font-semibold">Confirm Password</label>
					<input
						type="password"
						bind:value={confirmPassword}
						placeholder="Re-enter new password"
						class="w-full rounded-lg border border-gray-300 px-4 py-2"
					/>
				</div>

				<button
					disabled={loading}
					on:click={handleChangePassword}
					class="w-full rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
				>
					Change Password
				</button>
				<div class="pt-3">
					<a href="/auth" class="text-xs text-blue-500 hover:underline">Remembered your password?</a
					>
				</div>
			{/if}

			{#if step === 4}
				<div>
					<p class="mb-10 mt-2 rounded-lg bg-green-100 p-3 text-sm font-bold text-green-800">
						{successMessage}
					</p>
					<a
						href="/auth"
						class="mt-3 w-full rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
						>Return to Login</a
					>
				</div>
			{/if}
			{#if loading}
				<ProgressBar meter="bg-secondary-600" />
			{/if}
		</form>
	</div>
</div>
