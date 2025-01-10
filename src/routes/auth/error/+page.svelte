<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	// Optional: Redirect back to home or previous page
	function goBack() {
		window.history.back();
	}
</script>

<div class="container mx-auto flex h-lvh flex-col justify-center">
	<div class="space-y-4 text-center">
		<h1 class="text-6xl font-bold text-red-500">404</h1>
		<h2 class="text-2xl font-semibold text-gray-800">Oops! Page Not Found</h2>
		<p class="text-gray-600">Sorry, the page you're looking for doesn't exist or has been moved.</p>

		<button
			on:click={goBack}
			class="mt-6 rounded-lg bg-secondary-600 px-6 py-2 font-medium text-white hover:bg-secondary-700 focus:outline-none"
		>
			Go Back
		</button>

		<a href="/" class="mt-2 block text-sm text-secondary-600 hover:underline"> Return to Home </a>
	</div>
</div>
