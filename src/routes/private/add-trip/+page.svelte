<script lang="ts">
	import { goto } from '$app/navigation';
	import RangeSlider from 'svelte-range-slider-pips';
	import { 
		CalendarClock, 
		ChevronLeft, 
		MapPinned, 
		CircleUser, 
		Navigation 
	} from 'lucide-svelte';

	// Form variables
	let { data } = $props();

	function getLocalDateTime() {
		const now = new Date();
		const thirtyMinutesLater = new Date(now.getTime() + 30 * 60 * 1000);
		const year = thirtyMinutesLater.getFullYear();
		const month = String(thirtyMinutesLater.getMonth() + 1).padStart(2, '0');
		const day = String(thirtyMinutesLater.getDate()).padStart(2, '0');
		const hours = String(thirtyMinutesLater.getHours()).padStart(2, '0');
		const minutes = String(thirtyMinutesLater.getMinutes()).padStart(2, '0');

		return `${year}-${month}-${day}T${hours}:${minutes}`;
	}

	function convertToUTC(localTime) {
		const date = new Date(localTime);
		return date.toISOString();
	}

	let values = $state([2, 3]);
	let min = 2;
	let max = 6;
	let gap = 0;

	let time: string = $state(getLocalDateTime());
	let pickup_point: string = $state('');
	let pickup_point_id: string = $state('');
	let destination: string = $state('');
	let destination_id: string = $state('');
	let minPassengers: number = $derived(values[0]);
	let maxPassengers: number = $derived(values[1]);

	let isLoading = $state(false);
	let searchResults = $state([]);
	let destinationResults = $state([]);
	let isPickupFocused = $state(false);
	let isDestinationFocused = $state(false);

	// Function to handle form submission
	async function createTrip() {
		isLoading = true;
		const { data: similar_trips, error: error_similar_trips } = await data.supabase
			.from('trips')
			.select('*')
			.eq('pickup_point', pickup_point_id)
			.eq('destination', destination_id)
			.not('status', 'eq', 'closed')
			.single();

		if (similar_trips) {
			const confirmed = confirm('A similar trip already exists. Do you want to proceed?');
			if (!confirmed) {
				isLoading = false;
				return;
			}
		}
		const { data: trip, error } = await data.supabase
			.from('trips')
			.insert({
				departure_time: convertToUTC(time),
				pickup_point: pickup_point_id,
				destination: destination_id,
				min_pass: minPassengers,
				max_pass: maxPassengers,
				current_passengers: 1,
				created_by: data.user.id
			})
			.select('*')
			.single();

		if (error) {
			console.error('Error creating trip:', error);
		} else {
			console.log('Trip created successfully:', trip.id);
			goto(`/private/trips/${trip.id}`);
		}
		isLoading = false;
	}

	function translateLocations(locations: any[]) {
		return locations.map((location) => ({
			label: location.code ? `${location.code} - ${location.name}` : location.name,
			value: location.id.toString(),
			keywords: `${location.name}, ${location.location_type.toLowerCase()}, ${location.code}`,
			meta: { type: location.location_type.toLowerCase(), code: location.code }
		}));
	}

	const locationOptions = translateLocations(data.locations || []);

	function onPickupSearch() {
		if (!pickup_point) {
			searchResults = [];
			return;
		}
		
		const filteredLocations = locationOptions.filter(location => 
			location.label.toLowerCase().includes(pickup_point.toLowerCase()) ||
			location.keywords.toLowerCase().includes(pickup_point.toLowerCase())
		);
		
		searchResults = filteredLocations.slice(0, 5);
	}

	function onDestinationSearch() {
		if (!destination) {
			destinationResults = [];
			return;
		}
		
		const filteredLocations = locationOptions.filter(location => 
			location.label.toLowerCase().includes(destination.toLowerCase()) ||
			location.keywords.toLowerCase().includes(destination.toLowerCase())
		);
		
		destinationResults = filteredLocations.slice(0, 5);
	}

	function selectPickupLocation(location) {
		pickup_point = location.label;
		pickup_point_id = location.value;
		searchResults = [];
		isPickupFocused = false;
	}

	function selectDestination(location) {
		destination = location.label;
		destination_id = location.value;
		destinationResults = [];
		isDestinationFocused = false;
	}

	/**
	 * maintain a distance of 1 between the handles when
	 * the user is dragging the handle
	 */
	const slide = ({ detail }) => {
		if (detail.activeHandle === 0 && values[1] < detail.value + gap) {
			values[1] = detail.value + gap;
		}
		if (detail.activeHandle === 1 && values[0] > detail.value - gap) {
			values[0] = detail.value - gap;
		}
	};

	/**
	 * enforce the gap between the handles when the user
	 * stops dragging the handle
	 */
	const stop = ({ detail }) => {
		if (detail.activeHandle === 0 && detail.value >= max - gap) {
			values[0] = max - gap;
		}
		if (detail.activeHandle === 1 && detail.value <= min + gap) {
			values[1] = min + gap;
		}
	};
</script>

<div class="mx-auto max-w-2xl px-4 py-8">
	<a href="/private/trips" class="mb-6 inline-flex items-center text-gray-600 transition hover:text-amber-600">
		<ChevronLeft size={18} class="mr-1" />
		<span>Back to trips</span>
	</a>

	<div class="rounded-xl bg-white p-8 shadow-lg">
		<h1 class="mb-2 text-2xl font-bold text-gray-800">Create a new trip</h1>
		<p class="mb-6 text-gray-500">
			Enter your trip details below so others can join and share the costs
		</p>

		<form onsubmit={createTrip} class="space-y-8">
			<!-- Departure Time -->
			<div class="space-y-2">
				<label for="departure-time" class="flex items-center gap-2 font-medium text-gray-700">
					<CalendarClock size={18} class="text-amber-500" />
					<span>Departure date and time</span>
				</label>
				<input
					id="departure-time"
					type="datetime-local"
					bind:value={time}
					class="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
				/>
			</div>

			<!-- Pickup Location -->
			<div class="space-y-2">
				<label for="pickup-location" class="flex items-center gap-2 font-medium text-gray-700">
					<Navigation size={18} class="text-amber-500" />
					<span>Pickup location</span>
				</label>
				<div class="relative">
					<input
						id="pickup-location"
						type="text"
						bind:value={pickup_point}
						oninput={onPickupSearch}
						onfocus={() => isPickupFocused = true}
						placeholder="Search for pickup location..."
						class="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
					/>
					{#if isPickupFocused && searchResults.length > 0}
						<div class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
							{#each searchResults as result}
								<button
									type="button"
									onclick={() => selectPickupLocation(result)}
									class="w-full px-4 py-3 text-left hover:bg-amber-50"
								>
									{result.label}
								</button>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<!-- Destination -->
			<div class="space-y-2">
				<label for="destination" class="flex items-center gap-2 font-medium text-gray-700">
					<MapPinned size={18} class="text-amber-500" />
					<span>Destination</span>
				</label>
				<div class="relative">
					<input
						id="destination"
						type="text"
						bind:value={destination}
						oninput={onDestinationSearch}
						onfocus={() => isDestinationFocused = true}
						placeholder="Search for destination..."
						class="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
					/>
					{#if isDestinationFocused && destinationResults.length > 0}
						<div class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
							{#each destinationResults as result}
								<button
									type="button"
									onclick={() => selectDestination(result)}
									class="w-full px-4 py-3 text-left hover:bg-amber-50"
								>
									{result.label}
								</button>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<!-- Passenger Range -->
			<div class="space-y-2">
				<label class="flex items-center gap-2 font-medium text-gray-700">
					<CircleUser size={18} class="text-amber-500" />
					<span>Passengers ({minPassengers} - {maxPassengers})</span>
				</label>
				<div class="py-4">
					<RangeSlider
						range
						pushy
						pips
						all="label"
						bind:values
						on:change={slide}
						on:stop={stop}
						{min}
						{max}
						pipstep={1}
						first="label"
						last="label"
						float
						hoverable
					/>
				</div>
				<p class="text-xs text-gray-500">
					Select minimum and maximum passengers for your carpool
				</p>
			</div>

			<!-- Submit Button -->
			<button
				type="submit"
				disabled={isLoading}
				class="w-full rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 py-3 font-medium text-white shadow-md transition hover:from-amber-600 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-70"
			>
				{isLoading ? 'Creating trip...' : 'Create Trip'}
			</button>
			
			{#if isLoading}
				<div class="h-1 w-full overflow-hidden rounded-full bg-gray-100">
					<div class="h-full animate-pulse rounded-full bg-amber-400"></div>
				</div>
			{/if}
		</form>
	</div>
</div>

<style>
	:global(.slider-orange) {
		--range-handle: theme('colors.amber.500');
		--range-handle-focus: theme('colors.amber.600');
		--range-handle-inactive: theme('colors.amber.300');
		--range-handle-border: theme('colors.amber.600');
		--range-float-text: theme('colors.white');
		--range-float-bg: theme('colors.amber.500');
		--range-float-border: theme('colors.amber.600');
		--range-track: theme('colors.gray.100');
		--range-track-border: theme('colors.gray.300');
		--range-track-progress: theme('colors.amber.100');
	}
</style>