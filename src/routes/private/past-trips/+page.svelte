<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import {
		ChevronLeft,
		CircleArrowDown,
		CircleUser,
		MapPin,
		Calendar,
		Clock
	} from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	function formatHumanReadable(dateString) {
		const date = new Date(dateString); // Parses as UTC
		const localTime = new Date(
			date.toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur', hour12: false })
		); // Converts to local time

		const day = String(localTime.getUTCDate()).padStart(2, '0');
		const month = localTime.toLocaleString('en-US', { month: 'short' }); // Converts to "MMM"
		const year = localTime.getUTCFullYear();

		let hours = localTime.getHours();
		const minutes = String(localTime.getMinutes()).padStart(2, '0');

		const period = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12 || 12; // Convert to 12-hour format

		return `${day} ${month} ${year} ${String(hours).padStart(2, '0')}:${minutes} ${period}`;
	}

	function getStatusColor(status) {
		switch (status) {
			case 'available':
				return 'bg-green-100 text-green-700';
			case 'chat-opened':
				return 'bg-amber-100 text-amber-700';
			default:
				return 'bg-red-100 text-red-700';
		}
	}
</script>

<div class="max-w-3xl mx-auto flex flex-col gap-4 p-4">
	<div class="flex items-center justify-between mb-2">
		<a href="/private/trips" class="flex items-center gap-1 text-gray-700 hover:text-amber-600 transition-colors">
			<ChevronLeft class="h-5 w-5" />
			<span class="font-medium">Return to Trips</span>
		</a>
	</div>
	
	<h1 class="text-xl font-bold text-gray-800 mb-2">Your Past Trips</h1>

	{#if data.past_trips && data.past_trips.length > 0}
		<div class="grid gap-4">
			{#each data.past_trips as { trips }}
				<div class="rounded-lg bg-white p-5 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
					<div class="flex justify-between items-start mb-4">
						<span class={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(trips.status)}`}>
							{trips.status === 'chat-opened' ? 'Chat Started' : trips.status}
						</span>
						
						<div class="flex items-center gap-2 bg-amber-50 px-3 py-1 rounded-lg">
							<Calendar class="h-4 w-4 text-amber-500" />
							<Clock class="h-4 w-4 text-amber-500" />
							<p class="text-xs font-medium text-amber-700">
								{formatHumanReadable(trips.departure_time)}
							</p>
						</div>
					</div>
					
					<div class="flex flex-col md:flex-row gap-6 justify-between">
						<!-- Pickup and Destination Points -->
						<div class="flex gap-3">
							<div class="flex flex-col items-center">
								<div class="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
									<CircleArrowDown class="h-5 w-5 text-amber-600" />
								</div>
								<div class="h-12 w-0.5 bg-gray-200 my-1"></div>
								<div class="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
									<MapPin class="h-5 w-5 text-amber-600" />
								</div>
							</div>
							
							<div class="flex flex-col gap-4">
								<div>
									<p class="font-medium text-gray-800">{trips.pickup_location?.name || 'Unknown location'}</p>
									<p class="text-sm text-gray-500">Pickup point</p>
								</div>
								
								<div>
									<p class="font-medium text-gray-800">{trips.destination_location?.name || 'Unknown location'}</p>
									<p class="text-sm text-gray-500">Destination</p>
								</div>
							</div>
						</div>

						<!-- Passengers and action button -->
						<div class="flex flex-col md:items-end justify-between mt-4 md:mt-0">
							<div class="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg">
								<CircleUser class="h-5 w-5 text-gray-600" />
								<span class="text-sm font-medium text-gray-700">{trips.current_passengers}/{trips.max_pass} Passengers</span>
							</div>
							
							<button
								on:click={() => goto(`/private/trips/${trips.id}`)}
								class="mt-4 md:mt-auto rounded-lg bg-amber-600 px-5 py-2 text-white font-medium hover:bg-amber-700 transition-colors focus:ring-2 focus:ring-amber-300 focus:outline-none"
							>
								View Details
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow text-center">
			<div class="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-4">
				<Calendar class="h-8 w-8 text-amber-300" />
			</div>
			<p class="text-gray-600 mb-1">No past trips available.</p>
			<p class="text-sm text-gray-500">Your completed trips will appear here.</p>
		</div>
	{/if}
</div>