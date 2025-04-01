<script lang="ts">
	import type { PageData } from './$types';
	import { LucideStar, LucideStarHalf, LucideUser, LucidePhone,  LucideMessageSquareMore } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();
	
	// Format date to be more readable
	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { 
			year: 'numeric', 
			month: 'short', 
			day: 'numeric' 
		});
	}
</script>

<div class="container mx-auto max-w-4xl px-4 py-8 space-y-6">
	<!-- Profile Card -->
	<div class="rounded-xl bg-white p-6 shadow-lg border border-orange-100">
		<h2 class="text-center text-2xl font-semibold text-gray-800 mb-6">
			<span class="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">Profile</span>
		</h2>
		
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div class="flex items-start gap-3">
				<LucideUser class="text-orange-300 mt-1 flex-shrink-0" size={20} />
				<div>
					<p class="font-medium text-gray-500 text-sm">Name</p>
					<p class="text-gray-800 font-semibold">{data?.profile?.name || 'Not provided'}</p>
				</div>
			</div>

			{#if data?.profile?.ispublic}
				<div class="flex items-start gap-3">
					<LucidePhone class="text-orange-300 mt-1 flex-shrink-0" size={20} />
					<div>
						<p class="font-medium text-gray-500 text-sm">Phone</p>
						<p class="text-gray-800">{data?.profile?.phone || 'Not provided'}</p>
					</div>
				</div>
				
				<div class="flex items-start gap-3">
					<LucideMessageSquareMore class="text-orange-300 mt-1 flex-shrink-0" size={20} />
					<div>
						<p class="font-medium text-gray-500 text-sm">Telegram</p>
						<p class="text-gray-800">{data?.profile?.tg_username || 'Not provided'}</p>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Reviews Card -->
	<div class="rounded-xl bg-white p-6 shadow-lg border border-orange-100">
		<h2 class="text-center text-2xl font-semibold text-gray-800 mb-6">
			<span class="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">Reviews Received</span>
		</h2>
		
		{#if data.reviews && data.reviews.length > 0}
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				{#each data.reviews as review}
					<div class="w-full rounded-lg bg-gradient-to-br from-orange-50 to-yellow-50 p-5 shadow-sm transition-all duration-200 hover:shadow-md">
						<div class="flex flex-col gap-2">
							<div class="flex">
								{#each Array(5) as _, i}
									{#if i < Math.floor(review.rating)}
										<LucideStar class="text-yellow-400" fill="#FACC15" size={20} />
									{:else if i < Math.floor(review.rating) + 0.5}
										<LucideStarHalf class="text-yellow-400" fill="#FACC15" size={20} />
									{:else}
										<LucideStar class="text-gray-300" size={20} />
									{/if}
								{/each}
								<span class="ml-2 text-sm font-semibold text-gray-600">{review.rating}/5</span>
							</div>
							
							<p class="font-semibold text-gray-800 mt-1">{review.comment || 'No comment provided'}</p>
							
							<div class="mt-2 flex justify-between items-end text-sm">
								<span class="text-gray-600">By: {review.profiles?.name || 'Anonymous'}</span>
								<span class="text-gray-500">{formatDate(review.created_at)}</span>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<p class="text-center text-gray-500 italic py-6">No reviews yet</p>
		{/if}
	</div>
</div>