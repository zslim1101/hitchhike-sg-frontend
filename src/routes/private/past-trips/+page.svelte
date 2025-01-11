<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import {
		LucideChevronLeft,
		LucideCircleArrowDown,
		LucideCircleUser,
		LucideMapPin
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
</script>

<div class="flex w-full flex-col gap-3 overflow-x-auto p-2">
	<div class="mb-1">
		<a href="/private/trips" class="flex w-fit flex-row pr-3">
			<LucideChevronLeft />
			Return</a
		>
	</div>
	<p class="font-bold">Your Past Trips</p>

	{#if data.past_trips && data.past_trips.length > 0}
		{#each data.past_trips as { trips }}
			<div class="rounded-lg bg-white p-4 shadow">
				<div class="mb-1 flex items-center space-x-2 text-gray-700">
					<span class="text-sm font-bold">Ride Status:</span>
					<span
						class={'text-sm font-bold uppercase ' +
							(trips.status === 'available'
								? 'text-green-500'
								: trips.status === 'chat-opened'
									? 'text-secondary-500'
									: 'text-red-500')}
					>
						{trips.status === 'chat-opened' ? 'Chat has started' : trips.status}
					</span>
				</div>
				<div class="flex flex-row items-center justify-between">
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
							<p class="text-sm font-semibold text-gray-800">{trips.pickup_location?.name}</p>
							<p class="text-sm text-gray-500">Pickup point</p>
							<p class="mt-2 text-sm font-semibold text-gray-800">
								{trips.destination_location?.name}
							</p>
							<p class="text-sm text-gray-500">Destination</p>
						</div>
					</div>

					<!-- Time and Join Button -->
					<div class="flex flex-col justify-between space-y-10">
						<div class="flex w-full flex-row justify-center bg-secondary-100">
							<p class="w-fit rounded px-1 py-1 text-right text-xs font-bold text-secondary-600">
								{formatHumanReadable(trips.departure_time)}
							</p>
						</div>

						<div class="flex flex-row justify-end space-x-2">
							<div class="flex items-center space-x-1 text-gray-700">
								<span class="flex flex-row gap-1 font-bold"
									><div class="flex flex-col justify-end">
										<p class="mt-1">{trips.current_passengers}/{trips.max_pass}</p>
									</div>
									<div class="flex flex-col justify-center">
										<LucideCircleUser size="21" />
									</div></span
								>
								<span class="text-sm font-bold"></span>
							</div>

							<button
								onclick={() => {
									goto(`/private/trips/${trips.id}`);
								}}
								class="rounded bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
								>VIEW</button
							>
						</div>
					</div>
				</div>
			</div>
		{/each}
	{:else}
		<p class="text-center text-gray-500">No past trips available.</p>
	{/if}
</div>
