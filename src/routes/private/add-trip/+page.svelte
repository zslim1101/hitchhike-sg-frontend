<script lang="ts">
	import { goto } from '$app/navigation';
	import RangeSlider from 'svelte-range-slider-pips';
	import { Autocomplete, ProgressBar } from '@skeletonlabs/skeleton';
	import type { AutocompleteOption } from '@skeletonlabs/skeleton';
	import {
		LucideCalendarClock,
		LucideChevronLeft,
		LucideCircleArrowDown,
		LucideCircleUser,
		LucideMapPin
	} from 'lucide-svelte';

	import { Modal, getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent, ModalStore } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();
	const modal: ModalSettings = {
		type: 'confirm',
		// Data
		title: 'Please Confirm',
		body: 'Are you sure you wish to proceed?',
		backdropClasses: 'bg-gray-600',
		// TRUE if confirm pressed, FALSE if cancel pressed
		response: (r: boolean) => console.log('response:', r)
	};

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
		const date = new Date(localTime); // local time string from datetime-local input
		return date.toISOString(); // Converts it to UTC in ISO 8601 format
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

<div class="m-1">
	<div class="mb-1">
		<a href="/private/trips" class="flex w-fit flex-row pr-3">
			<LucideChevronLeft />
			Return</a
		>
	</div>
	<form onsubmit={createTrip} class="rounded-lg bg-white p-6 shadow-md">
		<h2 class="mb-2 text-xl font-semibold">Create a trip</h2>
		<p class="mb-4 text-sm text-gray-500">
			Enter information about the trip your are planning to make, so that others can join in and
			split the bill
		</p>

		<!-- Time Input -->
		<label for="date" class="label mb-1 font-bold"></label>
		<div class="mb-2 flex flex-row gap-2">
			<LucideCalendarClock /><span class="font-bold">Enter pick up date and time</span>
		</div>
		<input
			type="datetime-local"
			bind:value={time}
			class="mb-4 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
		/>

		<!-- Pickup Location Select -->
		<label for="pickup" class="label mt-6">
			<div class="flex flex-row gap-2">
				<LucideCircleArrowDown /><span class="font-bold">Enter pick up location</span>
			</div>
			<input
				class="input rounded-none px-4 py-2"
				type="search"
				bind:value={pickup_point}
				placeholder="Search your pick up location..."
			/>
			<div class="card max-h-48 w-full overflow-y-auto rounded-none p-4" tabindex="-1">
				<Autocomplete
					bind:input={pickup_point}
					options={locationOptions}
					on:selection={onPickupLocationSelection}
				/>
			</div>
		</label>

		<!-- Destination Select -->
		<label for="dest" class="label mt-6">
			<div class="flex flex-row gap-2">
				<LucideMapPin /><span class="font-bold">Enter drop off location</span>
			</div>
			<input
				class="input rounded-none px-4 py-2"
				type="search"
				bind:value={destination}
				placeholder="Search your drop off location..."
			/>
			<div class="card max-h-48 w-full overflow-y-auto rounded-none p-4" tabindex="-1">
				<Autocomplete
					bind:input={destination}
					options={locationOptions}
					on:selection={onDestinationSelection}
				/>
			</div>
		</label>
		<div class="mt-6 font-bold">
			<div class="flex flex-row gap-2">
				<LucideCircleUser /><span class="font-bold"
					>How many people do you want to carpool with</span
				>
			</div>
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
			/>
		</div>
		<p class="mb-4 text-xs text-gray-500">
			Choose the minimum and maximum amount of users for shared trip
		</p>

		<!-- Submit Button -->
		<div class="flex flex-col gap-1">
			<button
				type="submit"
				class="mt-10 w-full rounded bg-gray-800 py-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
			>
				Submit
			</button>
			{#if isLoading}
				<ProgressBar meter="bg-secondary-600" />
			{/if}
		</div>
	</form>
</div>
