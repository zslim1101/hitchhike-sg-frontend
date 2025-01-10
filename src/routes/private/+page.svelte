<script lang="ts">
	let { data } = $props();
</script>

<div class="flex h-screen flex-col items-center justify-center bg-gray-100 text-gray-800">
	<h1 class="mb-4 text-3xl font-bold">Hi, {data.user?.email}</h1>
	<p class="mb-8 text-lg">Welcome to your dashboard!</p>

	<a
		href="/private/trips"
		class="rounded bg-secondary-500 px-6 py-3 text-white transition hover:bg-secondary-600"
	>
		Go to Trips
	</a>
</div>
