<script lang="ts">
	// Form variables
	let { data } = $props();

	let time: string = $state('');
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
</script>

<div class="container mx-auto px-2">
	<form onsubmit={createTrip} class="max-w-sm rounded-lg bg-white p-6 shadow-md">
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
		<select
			bind:value={pickupLocation}
			class="mb-4 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
		>
			<option value="">Select location</option>
			<option value="Location 1">Location 1</option>
			<option value="Location 2">Location 2</option>
			<!-- Add more options as needed -->
		</select>

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

		<!-- Number of Passengers Slider -->
		<label for="min" class="mb-1 block text-sm font-medium text-gray-700"
			>Number of passengers</label
		>
		<div class="mb-2 flex items-center space-x-4">
			<span class="text-sm text-gray-700">{minPassengers}</span>
			<input type="range" min="2" max="4" bind:value={minPassengers} class="w-full" />
			<span class="text-sm text-gray-700">{maxPassengers}</span>
		</div>
		<p class="mb-4 text-xs text-gray-500">
			Choose the minimum and maximum amount of users for shared trip
		</p>

		<!-- Terms Checkbox -->
		<label class="mb-4 flex items-center text-sm text-gray-700">
			<input
				type="checkbox"
				bind:checked={acceptedTerms}
				class="mr-3 rounded border-gray-300 focus:ring-2 focus:ring-gray-400"
			/>
			<p class="pl-2">I accept the terms</p>
		</label>

		<!-- Terms Link -->
		<a href="/terms" class="mb-4 block text-sm text-gray-500 underline">Read our T&Cs</a>

		<!-- Submit Button -->
		<button
			type="submit"
			class="w-full rounded bg-gray-800 py-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
		>
			Submit
		</button>
	</form>
</div>
