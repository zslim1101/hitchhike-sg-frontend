<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="container mx-auto space-y-4">
	<div class="rounded-lg bg-white p-4 shadow-lg">
		<h2 class="text-center text-2xl font-semibold">Profile</h2>
		<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
			<div>
				<p class="block font-bold">Name</p>
				<p class="mt-1">{data?.profile?.name}</p>
			</div>
			<!-- <div>
				<p class="block font-bold">Email</p>
				<p class="mt-1">{data.user?.email}</p>
			</div> -->
			<div>
				<p class="block font-bold">Phone</p>
				<p class="mt-1">{data?.profile?.phone ?? 'No phone number'}</p>
			</div>
			<div>
				<p class="block font-bold">Telegram</p>
				<p class="mt-1">{data?.profile?.tg_username ?? 'No telegram username'}</p>
			</div>
		</div>
	</div>

	<div class="rounded-lg bg-white p-4 shadow-lg">
		<h2 class="text-center text-2xl font-semibold">Reviews Received:</h2>
		<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
			{#each data.reviews as review}
				<div class="w-full rounded-lg bg-white p-4 shadow-md">
					<div>
						<p class="font-bold">{review.comment}</p>
						<p class="text-sm text-gray-500">Rating: {review.rating}</p>
						<p class="text-sm text-gray-500">Given by: {review.profiles?.name}</p>
						<p class="text-right text-sm text-gray-500">
							Review Date: {new Date(review.created_at).toLocaleString()}
						</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
