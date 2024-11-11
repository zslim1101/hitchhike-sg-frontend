<script lang="ts">
	import { goto } from '$app/navigation';
	import { RangeSlider } from '@skeletonlabs/skeleton';
	import { Autocomplete } from '@skeletonlabs/skeleton';
	import type { AutocompleteOption } from '@skeletonlabs/skeleton';
	// Form variables
	let { data } = $props();

	function getLocalDateTime() {
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const day = String(now.getDate()).padStart(2, '0');
		const hours = String(now.getHours()).padStart(2, '0');
		const minutes = String(now.getMinutes()).padStart(2, '0');

		return `${year}-${month}-${day}T${hours}:${minutes}`;
	}
	let time: string = $state(getLocalDateTime());
	let pickup_point: string = $state('');
	let pickup_point_id: string = $state('');
	let destination: string = $state('');
	let destination_id: string = $state('');
	let minPassengers: number = $state(2);
	let maxPassengers: number = $state(4);

	// Function to handle form submission
	async function createTrip() {
		const { data: trips, error } = await data.supabase.from('trips').insert({
				departure_time:time,
				pickup_point:destination_id,
				destination:pickup_point_id,
				min_pass: minPassengers,
				max_pass: maxPassengers,
				current_passengers:1,
			});

		if (error) {
			console.error('Error creating trip:', error);
		} else {
			console.log('Trip created successfully:', trips);
			goto('/private/trips')
		}
	}

	function onDestinationSelection(event: CustomEvent<AutocompleteOption<string>>): void {
		destination = event.detail.label;
		destination_id = event.detail.value;
	}
	function onPickupLocationSelection(event: CustomEvent<AutocompleteOption<string>>): void {
		pickup_point = event.detail.label;
		pickup_point_id = event.detail.value;
	}

	function translateLocations(locations: any[]): AutocompleteOption<string>[] {
		return locations.map((location) => ({
			label: location.code ? `${location.code} - ${location.name}` : location.name,
			value: location.id.toString(),
			keywords: `${location.name}, ${location.location_type.toLowerCase()}, ${location.code}`,
			meta: { type: location.location_type.toLowerCase(), code: location.code }
		}));
	}

	const locationOptions: AutocompleteOption<string>[] = translateLocations(data.locations || []);
</script>

<div class="container mx-auto px-48">
	<form onsubmit={createTrip} class=" rounded-lg bg-white p-6 shadow-md">
		<h2 class="mb-2 text-xl font-semibold">Create a trip</h2>
		<p class="mb-4 text-sm text-gray-500">Enter information about your trip</p>

		<!-- Time Input -->
		<label for="date" class="label">Time</label>
		<input
			type="datetime-local"
			bind:value={time}
			class="mb-4 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
		/>

		<!-- Pickup Location Select -->
		<label for="pickup" class="label mt-6">
			<span class="font-bold">Where to pick you up?</span>
			<input
				class="input px-4 py-2"
				type="search"
				bind:value={pickup_point}
				placeholder="Search..."
			/>
			<div class="card max-h-48 w-full  overflow-y-auto p-4" tabindex="-1">
				<Autocomplete
					bind:input={pickup_point}
					options={locationOptions}
					on:selection={onPickupLocationSelection}
				/>
			</div>
		</label>

		<!-- Destination Select -->
		<label for="dest" class="label mt-6">
			<span class="font-bold">Where do you want to go?</span>
			<input
				class="input px-4 py-2"
				type="search"
				bind:value={destination}
				placeholder="Search..."
			/>
			<div class="card max-h-48 w-full  overflow-y-auto p-4" tabindex="-1">
				<Autocomplete
					bind:input={destination}
					options={locationOptions}
					on:selection={onDestinationSelection}
				/>
			</div>
		</label>
		<div class="mt-6 font-bold">
			<RangeSlider name="range-slider" bind:value={minPassengers} max={8} step={1} min={2}
				>Minimum Passengers ({minPassengers})</RangeSlider
			>
			<RangeSlider name="range-slider" bind:value={maxPassengers} max={8} step={1} min={minPassengers}
				>Maximum Passengers ({maxPassengers})</RangeSlider
			>
		</div>
		<p class="mb-4 text-xs text-gray-500">
			Choose the minimum and maximum amount of users for shared trip
		</p>

		<!-- Submit Button -->
		<button
			type="submit"
			class="mt-10 w-full rounded bg-gray-800 py-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
		>
			Submit
		</button>
	</form>
</div>
