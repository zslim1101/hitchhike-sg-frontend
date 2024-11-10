<script lang="ts">
	let { data } = $props();
</script>

<div class="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
	<h1 class="text-3xl font-bold mb-4">Hi, {data.user?.email}</h1>
	<p class="text-lg mb-8">Welcome to your dashboard!</p>
	
	<a 
		href="/private/trips" 
		class="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
	>
		Go to Trips
	</a>
</div>
