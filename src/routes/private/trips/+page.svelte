<script lang="ts">
	import { LucideCircleArrowDown, LucideCircleUser, LucideMapPin, LucidePlus } from 'lucide-svelte';
	let { data } = $props();

	interface RideCard {
		id: number;
		pickup: string;
		destination: string;
		time: string;
		spots: string;
	}

	// Sample data for demonstration
	let rides = data.trips;

	function formatHumanReadable(dateString) {
	const date = new Date(dateString); // Parses as UTC

	const day = String(date.getUTCDate()).padStart(2, '0');
	const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }); // Converts to "MMM"
	const year = date.getUTCFullYear();

	let hours = date.getUTCHours();
	const minutes = String(date.getUTCMinutes()).padStart(2, '0');

	const period = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12 || 12; // Convert to 12-hour format

	return `${day} ${month} ${year} ${String(hours).padStart(2, '0')}:${minutes} ${period}`;
}
</script>

<div class="space-y-4 ">
	<div class="flex flex-col gap-3 p-2 overflow-x-auto w-full">
		{#if rides}
			{#each rides as ride}
				<div class="flex flex-row  items-center justify-between rounded-lg bg-white p-4 shadow ">
					<!-- Pickup and Destination Points -->
					<div class="flex items-center space-x-4">
						<div class="text-center">
							<div class="text-gray-500">
								<span class="material-icons text-sm"><LucideCircleArrowDown /></span>
							</div>
							<div class="mx-auto my-1 h-6 w-px bg-gray-300"></div>
							<div class="text-gray-500">
								<span class="material-icons text-sm"><LucideMapPin /></span>
							</div>
						</div>
						<div>
							<p class="text-sm font-semibold text-gray-800">{ride.pickup_location?.name}</p>
							<p class="text-sm text-gray-500">Pickup point</p>
							<p class="mt-2 text-sm font-semibold text-gray-800">
								{ride.destination_location?.name}
							</p>
							<p class="text-sm text-gray-500">Destination</p>
						</div>
					</div>

					<!-- Time and Join Button -->
					<div class="flex flex-col justify-between space-y-10">
						<div class="flex w-full flex-row justify-center bg-blue-100 ">
							<p class="w-fit rounded  py-1 text-xs text-right font-bold text-blue-600 px-1">
								{formatHumanReadable(ride.departure_time)}
							</p>
						</div>
						<div class="flex flex-row justify-end space-x-2">
							<div class="flex items-center space-x-1 text-gray-700">
								<span class="font-bold flex flex-row gap-1"><div class="flex flex-col justify-end">
									<p class="mt-1">{ride.current_passengers}/{ride.max_pass}</p>
								</div><div class="flex flex-col justify-center"><LucideCircleUser size='21'/></div></span>
								<span class="text-sm font-bold"></span>
							</div>
							<button class="rounded bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
								>JOIN</button
							>
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
	<div class="mt-6 flex justify-center">
		<a
			href="/private/add-trip"
			class="flex flex-row justify-center gap-1 rounded bg-blue-500 px-4 py-3 font-bold text-white transition hover:bg-blue-600"
		>
			<LucidePlus />
			ADD NEW TRIP
		</a>
	</div>
</div>
