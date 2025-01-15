<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex flex-col items-center">
	<h1 class="mb-4 text-3xl font-semibold">Congratulations!</h1>
	<p class="mb-8 text-lg">
		Your Email has been verified. Now you can go and create your first trip.
	</p>
	<a
		href="/private/trips"
		class="rounded bg-secondary-500 px-6 py-3 text-white transition hover:bg-secondary-600"
		>Go and create your first trip</a
	>
</div>
