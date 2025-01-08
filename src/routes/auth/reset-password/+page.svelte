<script lang="ts">
	import { LucideArrowLeft } from 'lucide-svelte';
	import type { PageData } from './$types';

	let email = $state('');
	let { data }: { data: PageData } = $props();

	async function resetPassword() {
		if (email) {
			const { error } = await data.supabase.auth.resetPasswordForEmail(email, {
				redirectTo: window.location.origin + '/auth/confirm'
			});
			if (error) {
				alert(error.message);
			} else {
				alert('Check your email for a password reset link');
			}
		}
	}
</script>

<div class="mx-auto mt-3 max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg">
	<div class="flex items-center justify-start">
		<a href="/auth" class="mr-4 text-blue-500 hover:underline">
			<LucideArrowLeft size="24" />
		</a>
		<h2 class="text-center text-2xl font-semibold text-gray-800">Reset Password</h2>
	</div>

	<form onsubmit={resetPassword} class="space-y-6">
		<div class="space-y-2">
			<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
			<input
				type="email"
				id="email"
				bind:value={email}
				required
				class="w-full rounded-lg border px-4 py-2 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>

		<button
			type="submit"
			class="w-full rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700"
			>Reset Password</button
		>
	</form>
</div>
