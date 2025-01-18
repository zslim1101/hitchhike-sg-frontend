<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import {
		LucideCircleArrowDown,
		LucideCircleUser,
		LucideHistory,
		LucideMapPin,
		LucidePlus
	} from 'lucide-svelte';
	import { onMount } from 'svelte';
	let { data } = $props();

	const trips = $derived(data.trips);
	const my_trips = $derived(data.my_trips);

	let isjoiningaTrip = $state(false);

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

	const handleUserJoin = async (ride) => {
		isjoiningaTrip = true;
		if (ride?.current_passengers > ride.max_pass) {
			alert('full');
			isjoiningaTrip = false;
			return;
		}

		const { error } = await data.supabase.from('trip_passengers').insert({
			trip_id: ride.id,
			user_id: data.user?.id,
			name: data.user?.user_metadata.name
		});

		if (error) {
			alert('You already joined');
		} else {
			let status = 'available';
			if (ride?.current_passengers + 1 === ride.max_pass) {
				status = 'chat-opened';
			}

			const { error: updateError } = await data.supabase
				.from('trips')
				.update({ current_passengers: ride?.current_passengers + 1, status })
				.eq('id', ride.id);

			if (updateError) {
				alert('Full');
			} else {
				data.supabase.removeAllChannels();
				goto(`/private/trips/${ride.id}`);
				isjoiningaTrip = false;
				return;
			}
			isjoiningaTrip = false;
		}
	};

	onMount(() => {
		const channel = data.supabase
			.channel('public:trips')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'trips' }, (payload) => {
				console.log(payload);
				invalidate('trips:all-trips');
			})
			.subscribe();

		return () => {
			data.supabase.removeChannel(channel);
		};
	});
</script>

<div class="space-y-4">
	{#if isjoiningaTrip}
		<ProgressBar meter="bg-secondary-600" />
	{/if}
	<div class="flex w-full flex-col gap-3 overflow-x-auto p-2">
		<p class="font-bold">Current Trip</p>
		{#if my_trips && my_trips.length > 0}
			{#each my_trips as ride}
				<div class="rounded-lg border border-green-700 bg-white p-4 shadow">
					<div class="mb-3 flex items-center justify-between space-x-2 text-gray-700">
						<div class="flex flex-col space-x-2 sm:flex-row">
							<span class="text-sm font-bold">Ride Status:</span>
							<span
								class={'text-sm font-bold uppercase ' +
									(ride.status === 'available'
										? 'text-green-500'
										: ride.status === 'chat-opened'
											? 'text-secondary-500'
											: 'text-red-500')}
							>
								{ride.status === 'chat-opened' ? 'Chat has started' : ride.status}
							</span>
						</div>
						<div class="flex flex-col justify-start">
							<div class="flex w-full flex-row justify-center bg-secondary-100">
								<p class="w-fit rounded px-1 py-1 text-right text-xs font-bold text-secondary-600">
									{formatHumanReadable(ride?.departure_time)}
								</p>
							</div>
						</div>
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
							<div></div>

							<div class="flex flex-row justify-end space-x-2">
								<div class="flex items-center space-x-1 text-gray-700">
									<span class="flex flex-row gap-1 font-bold"
										><div class="flex flex-col justify-end">
											<p class="mt-1">{ride.current_passengers}/{ride.max_pass}</p>
										</div>
										<div class="flex flex-col justify-center">
											<LucideCircleUser size="21" />
										</div></span
									>
									<span class="text-sm font-bold"></span>
								</div>

								<button
									onclick={() => {
										goto(`/private/trips/${ride.id}`);
									}}
									class="rounded bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
									>VIEW</button
								>
							</div>
						</div>
					</div>
				</div>
			{/each}
		{:else if data.joined_trips}
			{#await data.supabase
				.from('trips')
				.select('*,destination_location:locations!trips_destination_fkey!inner(*),pickup_location:locations!trips_pickup_point_fkey!inner(*)')
				.eq('id', data.joined_trips.trip_id)
				.maybeSingle()}
				<p>Loading..</p>
			{:then { data: trip_info }}
				{#if trip_info}
					<div class="rounded-lg border border-green-700 bg-white p-4 shadow">
						<div class="mb-3 flex items-center justify-between space-x-2 text-gray-700">
							<div class="flex flex-col space-x-2 sm:flex-row">
								<span class="text-sm font-bold">Ride Status:</span>
								<span
									class={'text-sm font-bold uppercase ' +
										(trip_info.status === 'available'
											? 'text-green-500'
											: trip_info.status === 'chat-opened'
												? 'text-secondary-500'
												: 'text-red-500')}
								>
									{trip_info.status === 'chat-opened' ? 'Chat has started' : trip_info.status}
								</span>
							</div>
							<div class="flex flex-col justify-start">
								<div class="flex w-full flex-row justify-center bg-secondary-100">
									<p
										class="w-fit rounded px-1 py-1 text-right text-xs font-bold text-secondary-600"
									>
										{formatHumanReadable(trip_info?.departure_time)}
									</p>
								</div>
							</div>
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
									<p class="text-sm font-semibold text-gray-800">
										{trip_info.pickup_location?.name}
									</p>
									<p class="text-sm text-gray-500">Pickup point</p>
									<p class="mt-2 text-sm font-semibold text-gray-800">
										{trip_info.destination_location?.name}
									</p>
									<p class="text-sm text-gray-500">Destination</p>
								</div>
							</div>

							<!-- Time and Join Button -->
							<div class="flex flex-col justify-between space-y-10">
								<div></div>
								<div class="flex flex-row justify-end space-x-2">
									<div class="flex items-center space-x-1 text-gray-700">
										<span class="flex flex-row gap-1 font-bold"
											><div class="flex flex-col justify-end">
												<p class="mt-1">{trip_info.current_passengers}/{trip_info.max_pass}</p>
											</div>
											<div class="flex flex-col justify-center">
												<LucideCircleUser size="21" />
											</div></span
										>
										<span class="text-sm font-bold"></span>
									</div>
									<button
										onclick={() => {
											goto(`/private/trips/${trip_info.id}`);
										}}
										class="rounded bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
										>VIEW</button
									>
								</div>
							</div>
						</div>
					</div>
				{:else}
					<div class="flex flex-col items-center justify-center p-4 text-center">
						<p class="text-2xl font-bold">You currently have no trips</p>
						<p class="text-gray-500">Either join an existing trip or create a new one</p>
						<a
							href="/private/add-trip"
							class="mt-4 rounded bg-secondary-500 px-4 py-2 text-white transition hover:bg-secondary-600"
						>
							Create a Trip
						</a>
					</div>
				{/if}
			{/await}
		{:else}
			<div class="flex flex-col items-center justify-center p-4 text-center">
				<p class="text-2xl font-bold">You currently have no trips</p>
				<p class="text-gray-500">Either join an existing trip or create a new one</p>
				<a
					href="/private/add-trip"
					class="mt-4 rounded bg-secondary-500 px-4 py-2 text-white transition hover:bg-secondary-600"
				>
					Create a Trip
				</a>
			</div>
		{/if}
		<p class="font-bold">Other Trips</p>
		{#if isjoiningaTrip}
			<p>Joining a trip</p>
		{/if}
		{#if trips && trips.length > 0 && !(my_trips && my_trips.length > 0)}
			{#each trips as ride}
				{#if data.joined_trips?.trip_id !== ride.id}
					<div class="rounded-lg bg-white p-4 shadow">
						<div class="mb-3 flex items-center justify-between space-x-2 text-gray-700">
							<div class="flex flex-col space-x-2 sm:flex-row">
								<span class="text-sm font-bold">Ride Status:</span>
								<span
									class={'text-sm font-bold uppercase ' +
										(ride.status === 'available'
											? 'text-green-500'
											: ride.status === 'chat-opened'
												? 'text-secondary-500'
												: 'text-red-500')}
								>
									{ride.status === 'chat-opened' ? 'Chat has started' : ride.status}
								</span>
							</div>
							<div class="flex flex-col justify-start">
								<div class="flex w-full flex-row justify-center bg-secondary-100">
									<p
										class="w-fit rounded px-1 py-1 text-right text-xs font-bold text-secondary-600"
									>
										{formatHumanReadable(ride?.departure_time)}
									</p>
								</div>
							</div>
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
								<div></div>
								<div class="flex flex-row justify-end space-x-2">
									<div class="flex flex-col items-center justify-end space-x-1 text-gray-700">
										<span class="mb-1 flex flex-row gap-1 font-bold"
											><div class="flex flex-col justify-end">
												<p class="mt-1">{ride.current_passengers}/{ride.max_pass}</p>
											</div>
											<div class="flex flex-col justify-center">
												<LucideCircleUser size="21" />
											</div></span
										>
										<span class="text-sm font-bold"></span>
									</div>

									<div class="flex flex-col">
										<button
											class="mb-1 rounded border border-cyan-600 bg-white px-4 py-2 text-cyan-800 hover:bg-cyan-500 hover:text-white disabled:bg-gray-300"
											onclick={() => {
												goto(`/private/trips/${ride.id}`);
											}}>VIEW</button
										>
										<button
											onclick={async () => {
												await handleUserJoin(ride);
											}}
											disabled={(my_trips && my_trips.length > 0) ||
												data.joined_trips !== null ||
												// data.joined_trips?.trip_id === ride.id ||
												ride.current_passengers === ride.max_pass}
											class="rounded border border-primary-600 bg-primary-600 px-4 py-2 font-bold text-white hover:bg-white hover:text-primary-600 disabled:bg-gray-300"
										>
											{ride.current_passengers === ride.max_pass ? 'FULL' : 'JOIN'}
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				{/if}
			{/each}
		{:else if my_trips && my_trips.length > 0}
			<p class="bg-gray-100 p-3 text-center">You are in a trip right now leave/cancel it first</p>
		{:else}
			<p class="bg-gray-100 p-3 text-center">No trips right now</p>
		{/if}
	</div>

	<div class="mt-6 flex justify-center">
		<a
			href="/private/past-trips"
			class="flex flex-row justify-center gap-1 text-gray-600 transition hover:text-gray-800"
		>
			<LucideHistory />
			View Past Trips
		</a>
	</div>

	<!-- <div class="mt-6 flex justify-center">
		{#if data.joined_trips || my_trips && my_trips.length > 0}
		<div
		class="flex flex-row justify-center gap-1 rounded bg-red-200 px-4 py-3 font-bold text-white transition "
	>
		LEAVE CURRENT TRIP FIRST
	</div>
		{:else}
		<a
			href="/private/add-trip"
			class="flex flex-row justify-center gap-1 rounded bg-secondary-500 px-4 py-3 font-bold text-white transition hover:bg-secondary-600"
		>
			<LucidePlus />
			ADD NEW TRIP
		</a>
		{/if}
		
	</div> -->
</div>
