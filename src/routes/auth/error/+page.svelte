<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;
	// Optional: Redirect back to home or previous page
	function goBack() {
		window.history.back();
	}
</script>

<div class="container mx-auto h-lvh flex flex-col justify-center">
	<div class="text-center space-y-4">
		<h1 class="text-6xl font-bold text-red-500">404</h1>
		<h2 class="text-2xl font-semibold text-gray-800">Oops! Page Not Found</h2>
		<p class="text-gray-600">
			Sorry, the page you're looking for doesn't exist or has been moved.
		</p>
		
		<button
			on:click={goBack}
			class="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none"
		>
			Go Back
		</button>
		
		<a
			href="/"
			class="block mt-2 text-blue-600 hover:underline text-sm"
		>
			Return to Home
		</a>
	</div>
</div>