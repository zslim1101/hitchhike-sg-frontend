<script lang="ts">
	import { RangeSlider } from '@skeletonlabs/skeleton';
	import { Autocomplete } from '@skeletonlabs/skeleton';
	import type { AutocompleteOption } from '@skeletonlabs/skeleton';
	// Form variables
	let { data } = $props();

	let time: string = $state(Date());
	let pickupLocation: string = $state('');
	let destination: string = $state('');
	let minPassengers: number = $state(2);
	let maxPassengers: number = $state(4);
	let acceptedTerms: boolean = $state(false);

	// Function to handle form submission
	async function createTrip() {
		if (!acceptedTerms) {
			alert('Please accept the terms and conditions.');
			return;
		}

		const { data: trips, error } = await data.supabase.from('trips').insert([
			{
				time,
				pickup_location: pickupLocation,
				destination,
				min_passengers: minPassengers,
				max_passengers: maxPassengers,
				accepted_terms: acceptedTerms
			}
		]);

		if (error) {
			console.error('Error creating trip:', error);
		} else {
			console.log('Trip created successfully:', data);
			alert('Trip created successfully!');
		}
	}

	function onFlavorSelection(event: CustomEvent<AutocompleteOption<string>>): void {
		pickupLocation = event.detail.label;
	}

	function translateLocations(locations: any[]): AutocompleteOption<string>[] {
		return locations.map((location) => ({
			label: location.name,
			value: location.id.toString(),
			keywords: location.name.split(' ').join(', '), // Assuming keywords are space-separated words from the name
			meta: { type: location.location_type.toLowerCase() }
		}));
	}

	const locationOptions: AutocompleteOption<string>[] = translateLocations(data.locations);
</script>

<div class="container mx-auto">
	<form onsubmit={createTrip} class=" rounded-lg bg-white p-6 shadow-md">
		<h2 class="mb-2 text-xl font-semibold">Create a trip</h2>
		<p class="mb-4 text-sm text-gray-500">Enter information about your trip</p>

		<!-- Time Input -->
		<label for="date" class="mb-1 block text-sm font-medium text-gray-700">Time</label>
		<input
			type="datetime-local"
			bind:value={time}
			class="mb-4 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
		/>

		<!-- Pickup Location Select -->
		<label for="pickup" class="mb-1 block text-sm font-medium text-gray-700"
			>Where to pick you up?</label
		>
		<input
			class="input"
			type="search"
			name="demo"
			bind:value={pickupLocation}
			placeholder="Search..."
		/>
		<div class="card max-h-48 w-full max-w-sm overflow-y-auto p-4" tabindex="-1">
			<Autocomplete
				bind:input={pickupLocation}
				options={locationOptions}
				on:selection={onFlavorSelection}
			/>
		</div>
		<!-- Destination Select -->
		<label for="dest" class="mb-1 block text-sm font-medium text-gray-700"
			>Where do you want to go?</label
		>
		<select
			bind:value={destination}
			class="mb-4 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
		>
			<option value="">Select destination</option>
			<option value="Destination 1">Destination 1</option>
			<option value="Destination 2">Destination 2</option>
			<!-- Add more options as needed -->
		</select>

		<RangeSlider name="range-slider" bind:value={minPassengers} max={25} step={1} min={3}
			>Minimum Passengers</RangeSlider
		>
		<RangeSlider name="range-slider" bind:value={maxPassengers} max={25} step={1} min={3}
			>Maximum Passengers</RangeSlider
		>
		<p class="mb-4 text-xs text-gray-500">
			Choose the minimum and maximum amount of users for shared trip
		</p>

		<!-- Submit Button -->
		<button
			type="submit"
			class="w-full rounded bg-gray-800 py-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
		>
			Submit
		</button>
	</form>
</div>
