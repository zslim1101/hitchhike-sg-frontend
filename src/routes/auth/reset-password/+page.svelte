<script lang="ts">
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import { CheckCircle, AlertCircle, ArrowLeft, KeyRound, Mail, LockKeyhole } from 'lucide-svelte';

	export let data: PageData;
	$: ({ supabase, session } = data);

	let loading = false;
	let email = '';
	let token = '';
	let successMessage = '';
	let errorMessage = '';

	let newPassword = '';
	let confirmPassword = '';
	let step = 1;

	const handleResetPass = async () => {
		if (!email || email === '') {
			errorMessage = 'Please enter your email address';
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
		if (!token || token === '') {
			errorMessage = 'Please enter the OTP from your email';
			return;
		}
		loading = true;
		const { error } = await supabase.auth.verifyOtp({ email, token, type: 'recovery' });
		if (!error) {
			step = 3;
			successMessage = '';
		} else {
			errorMessage = error.message;
		}
		loading = false;
	};

	const handleChangePassword = async () => {
		if (!newPassword || newPassword === '') {
			errorMessage = 'Please enter a new password';
			return;
		}
		if (newPassword !== confirmPassword) {
			errorMessage = 'Passwords do not match';
			return;
		}

		loading = true;
		const { error } = await supabase.auth.updateUser({ password: newPassword });
		if (error) {
			errorMessage = error.message;
		} else {
			errorMessage = '';
			successMessage = 'Password updated successfully';
			step = 4;
		}
		loading = false;
	};

	const resetForm = () => {
		errorMessage = '';
		successMessage = '';
		email = '';
		token = '';
		newPassword = '';
		confirmPassword = '';
		step = 1;
	};
</script>

<svelte:head>
	<title>Reset Password | Carpool Asia</title>
</svelte:head>

<div class="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
	<div class="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
		<div class="mb-6 flex items-center justify-between">
			<h1 class="text-2xl font-bold text-gray-800">Reset Password</h1>
			{#if step !== 1 && step !== 4}
				<button 
					class="flex items-center text-sm text-gray-500 hover:text-orange-500 transition-colors"
					on:click={resetForm}
				>
					<ArrowLeft size={16} class="mr-1" />
					Start over
				</button>
			{/if}
		</div>

		<!-- Progress indicator -->
		<div class="mb-6">
			<div class="flex justify-between">
				{#each ['Email', 'Verification', 'New Password', 'Done'] as stageName, index}
					<div class="flex flex-col items-center">
						<div class={`h-8 w-8 flex items-center justify-center rounded-full border-2 ${
							step > index ? 'bg-orange-500 border-orange-500 text-white' : 
							step === index + 1 ? 'border-orange-500 text-orange-500' : 
							'border-gray-300 text-gray-300'
						}`}>
							{index + 1}
						</div>
						<span class={`mt-1 text-xs ${
							step > index ? 'text-orange-500 font-medium' : 
							step === index + 1 ? 'text-gray-800 font-medium' : 
							'text-gray-400'
						}`}>{stageName}</span>
					</div>
					{#if index < 3}
						<div class={`w-full h-0.5 mt-4 ${step > index + 1 ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
					{/if}
				{/each}
			</div>
		</div>

		{#if successMessage}
			<div class="mb-6 flex items-start rounded-lg bg-green-50 p-4 text-green-800">
				<CheckCircle size={20} class="mr-2 mt-0.5 flex-shrink-0" />
				<p>{successMessage}</p>
			</div>
		{/if}

		{#if errorMessage}
			<div class="mb-6 flex items-start rounded-lg bg-red-50 p-4 text-red-800">
				<AlertCircle size={20} class="mr-2 mt-0.5 flex-shrink-0" />
				<p>{errorMessage}</p>
			</div>
		{/if}

		<div>
			{#if step === 1}
				<div class="mb-6">
					<label for="email" class="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
					<div class="relative">
						<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
							<Mail size={18} />
						</div>
						<input
							type="email"
							id="email"
							bind:value={email}
							placeholder="your@email.com"
							class="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
						/>
					</div>
					<p class="mt-2 text-xs text-gray-500">We'll send a one-time password to this email</p>
				</div>
				<button
					disabled={loading}
					on:click={handleResetPass}
					class="w-full rounded-lg bg-orange-500 py-3 font-medium text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
				>
					{loading ? 'Sending...' : 'Send One-Time Password'}
				</button>
				<div class="mt-4 text-center">
					<a href="/auth" class="text-sm text-orange-500 hover:underline">Return to login</a>
				</div>
			{:else if step === 2}
				<div class="mb-6">
					<label for="token" class="mb-2 block text-sm font-medium text-gray-700">Enter One-Time Password</label>
					<div class="relative">
						<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
							<KeyRound size={18} />
						</div>
						<input
							type="text"
							id="token"
							bind:value={token}
							placeholder="Enter OTP from your email"
							class="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
						/>
					</div>
					<p class="mt-2 text-xs text-gray-500">Check your email inbox for the verification code</p>
				</div>
				<button
					disabled={loading}
					on:click={handleSendToken}
					class="w-full rounded-lg bg-orange-500 py-3 font-medium text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
				>
					{loading ? 'Verifying...' : 'Verify Code'}
				</button>
				<div class="mt-4 text-center">
					<a href="/auth" class="text-sm text-orange-500 hover:underline">Return to login</a>
				</div>
			{:else if step === 3}
				<div class="mb-4">
					<label for="newPassword" class="mb-2 block text-sm font-medium text-gray-700">New Password</label>
					<div class="relative">
						<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
							<LockKeyhole size={18} />
						</div>
						<input
							type="password"
							id="newPassword"
							bind:value={newPassword}
							placeholder="Enter new password"
							class="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
						/>
					</div>
				</div>
				<div class="mb-6">
					<label for="confirmPassword" class="mb-2 block text-sm font-medium text-gray-700">Confirm Password</label>
					<div class="relative">
						<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
							<LockKeyhole size={18} />
						</div>
						<input
							type="password"
							id="confirmPassword"
							bind:value={confirmPassword}
							placeholder="Confirm new password"
							class="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
						/>
					</div>
					<p class="mt-2 text-xs text-gray-500">Password must be at least 6 characters long</p>
				</div>
				<button
					disabled={loading}
					on:click={handleChangePassword}
					class="w-full rounded-lg bg-orange-500 py-3 font-medium text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
				>
					{loading ? 'Updating...' : 'Update Password'}
				</button>
				<div class="mt-4 text-center">
					<a href="/auth" class="text-sm text-orange-500 hover:underline">Return to login</a>
				</div>
			{:else if step === 4}
				<div class="mb-8 flex flex-col items-center justify-center text-center">
					<div class="mb-4 rounded-full bg-green-100 p-3">
						<CheckCircle size={32} class="text-green-600" />
					</div>
					<h2 class="mb-2 text-xl font-bold text-gray-800">Password Reset Complete</h2>
					<p class="text-gray-600">Your password has been successfully updated. You can now log in with your new password.</p>
				</div>
				<a
					href="/auth"
					class="block w-full rounded-lg bg-orange-500 py-3 text-center font-medium text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
				>
					Return to Login
				</a>
			{/if}
		</div>

		{#if loading}
			<div class="mt-4">
				<ProgressBar meter="bg-orange-500" track="bg-orange-100" />
			</div>
		{/if}
	</div>
</div>