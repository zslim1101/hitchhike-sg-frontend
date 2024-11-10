<script lang="ts">
	import { TabGroup, Tab, TabAnchor } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	let isLoginView = true; // Default view is Login
	let tabSet: number = 0;
	// Function to switch the view based on the hash in URL
	function checkHash() {
		isLoginView = window.location.hash === '#login' || window.location.hash === '';
		if (isLoginView) {
			tabSet = 0;
		} else {
			tabSet = 1;
		}
	}

	// Update view on page load and hash change
	onMount(() => {
		checkHash();
		window.addEventListener('hashchange', checkHash);
		// Clean up the event listener
		return () => window.removeEventListener('hashchange', checkHash);
	});
</script>

<div class="mx-auto max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg">
	<h2 class="text-center text-2xl font-semibold text-gray-800">
		{tabSet === 0 ? 'Login' : 'Register'}
	</h2>

	<TabGroup>
		<Tab bind:group={tabSet} name="tab1" value={0}>
			<span>Login</span>
		</Tab>
		<Tab bind:group={tabSet} name="tab2" value={1}>Register</Tab>
		<!-- Tab Panels --->
		<svelte:fragment slot="panel">
			{#if tabSet === 0}
				<!-- Login Form -->
				<form method="POST" action="?/login" class="space-y-6">
					<div class="space-y-2">
						<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
						<input
							name="email"
							type="email"
							class="w-full rounded-lg border px-4 py-2 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div class="space-y-2">
						<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
						<input
							name="password"
							type="password"
							class="w-full rounded-lg border px-4 py-2 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div class="flex justify-center">
						<button
							type="submit"
							class="w-full rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700"
						>
							Login
						</button>
					</div>
				</form>
			{:else if tabSet === 1}
				<!-- Register Form -->
				<form method="POST" action="?/signup" class="space-y-6">
					<div class="space-y-2">
						<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
						<input
							name="email"
							type="email"
							class="w-full rounded-lg border px-4 py-2 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div class="space-y-2">
						<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
						<input
							name="password"
							type="password"
							class="w-full rounded-lg border px-4 py-2 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div class="space-y-2">
						<label for="username" class="block text-sm font-medium text-gray-700">Name</label>
						<input
							name="username"
							type="text"
							class="w-full rounded-lg border px-4 py-2 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div class="space-y-2">
						<label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
						<input
							name="phone"
							type="tel"
							class="w-full rounded-lg border px-4 py-2 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div class="flex justify-center">
						<button
							type="submit"
							class="w-full rounded-lg bg-green-600 py-2 font-medium text-white hover:bg-green-700"
						>
							Register
						</button>
					</div>
				</form>
			{/if}
		</svelte:fragment>
	</TabGroup>
</div>
