<script lang="ts">
    import { LucideCircleArrowDown, LucideMapPin } from "lucide-svelte";
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
		{ id: 1, pickup: "MRT BTHO GATE 1", destination: "KLIA 2 AIRPORT", time: "12:30 pm", spots: "1/4" },
		{ id: 2, pickup: "MRT BTHO GATE 2", destination: "KLIA 1 AIRPORT", time: "1:00 pm", spots: "2/4" },
	];

</script>

<div class="space-y-4 p-4">
	{#each rides as ride}
		<div class="flex items-center justify-between p-4 bg-white shadow rounded-lg">
			<!-- Pickup and Destination Points -->
			<div class="flex items-center space-x-4">
				<div class="text-center">
					<div class="text-gray-500">
						<span class="material-icons text-lg"><LucideCircleArrowDown/></span>
					</div>
					<div class="w-px h-6 bg-gray-300 mx-auto my-1"></div>
					<div class="text-gray-500">
						<span class="material-icons text-lg"><LucideMapPin/></span>
					</div>
				</div>
				<div>
					<p class="text-lg font-semibold text-gray-800">{ride.pickup}</p>
					<p class="text-sm text-gray-500">Pickup point</p>
					<p class="text-lg font-semibold text-gray-800 mt-2">{ride.destination}</p>
					<p class="text-sm text-gray-500">Destination</p>
				</div>
			</div>

			<!-- Time and Join Button -->
			<div class="flex items-center space-x-4">
				<div class="text-lg font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">{ride.time}</div>
				<div class="flex items-center space-x-1 text-gray-700">
					<span class="material-icons text-lg">person</span>
					<span>{ride.spots}</span>
				</div>
				<button class="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">Join</button>
			</div>
		</div>
	{/each}
    <div class="flex justify-center mt-6">
        <a href="/private/add-trip" class="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
            Add New Trip
        </a>
    </div>
</div>
