<script lang="ts">
	import { LucideCircleArrowDown, LucideMapPin, LucidePlus } from 'lucide-svelte';
	let { data } = $props();

	interface RideCard {
		id: number;
		pickup: string;
		destination: string;
		time: string;
		spots: string;
	}

	// Sample data for demonstration
	let rides: RideCard[] = [
		{
			id: 1,
			pickup: 'MRT BTHO GATE 1',
			destination: 'KLIA 2 AIRPORT',
			time: '12:30 pm',
			spots: '1/4'
		},
		{
			id: 2,
			pickup: 'MRT BTHO GATE 2',
			destination: 'KLIA 1 AIRPORT',
			time: '1:00 pm',
			spots: '2/4'
		}
	];
</script>

<div class="space-y-4 p-4">
	{#each rides as ride}
		<div class="flex items-center justify-between rounded-lg bg-white p-4 shadow">
			<!-- Pickup and Destination Points -->
			<div class="flex items-center space-x-4">
				<div class="text-center">
					<div class="text-gray-500">
						<span class="material-icons text-lg"><LucideCircleArrowDown /></span>
					</div>
					<div class="mx-auto my-1 h-6 w-px bg-gray-300"></div>
					<div class="text-gray-500">
						<span class="material-icons text-lg"><LucideMapPin /></span>
					</div>
				</div>
				<div>
					<p class="text-lg font-semibold text-gray-800">{ride.pickup}</p>
					<p class="text-sm text-gray-500">Pickup point</p>
					<p class="mt-2 text-lg font-semibold text-gray-800">{ride.destination}</p>
					<p class="text-sm text-gray-500">Destination</p>
				</div>
			</div>

			<!-- Time and Join Button -->
			<div class="flex flex-col justify-between space-y-10">
				<div class="flex w-full flex-row justify-end">
					<div class="w-fit rounded bg-blue-100 px-2 py-1 text-lg font-bold text-blue-600">
						{ride.time}
					</div>
				</div>
				<div class="flex flex-row space-x-2">
					<div class="flex items-center space-x-1 text-gray-700">
						<span class="font-bold">{ride.spots}</span>
						<span class="text-lg font-bold"></span>
					</div>
					<button class="rounded bg-teal-600 px-4 py-2 text-white hover:bg-teal-700">JOIN</button>
				</div>
			</div>
		</div>
	{/each}
	<div class="mt-6 flex justify-center">
		<a
			href="/private/add-trip"
			class="rounded bg-blue-500 px-4 py-3 font-bold text-white transition hover:bg-blue-600 flex flex-row justify-center gap-1"
		>
        <LucidePlus/>
			ADD NEW TRIP
		</a>
	</div>
</div>
