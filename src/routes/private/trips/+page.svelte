<script lang="ts">
	import { goto } from '$app/navigation';
	import { LucideCircleArrowDown, LucideCircleUser, LucideMapPin, LucidePlus } from 'lucide-svelte';
	import { onMount } from 'svelte';
	let { data } = $props();

	interface RideCard {
		id: number;
		pickup: string;
		destination: string;
		time: string;
		spots: string;
	}

	let trips = data.trips;
	let my_trips = data.my_trips;

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

	const handleUserJoin = async (ride) => {

		if(ride?.current_passengers > ride.max_pass){
			alert('full')
			return
		}

		const {error} = await data.supabase.from('trip_passengers').insert({
			trip_id: ride.id,
			user_id: data.user?.id,
			name: data.user?.user_metadata.name
		})


		if(error){
			alert('You have joined')
		}else {
			
			const {error:updateError} = await data.supabase.from('trips').update({current_passengers:ride?.current_passengers+1}).eq('id',ride.id)

			if(updateError){
				alert('Full')
			}else {
				goto(`/private/trips/${ride.id}`)
			}

		}

	}

	

</script>

<div class="space-y-4">
	<div class="flex flex-col gap-3 p-2 overflow-x-auto w-full">
		<p>Your Trip</p>
		{#if my_trips && my_trips.length > 0}
		{#each my_trips as ride}
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
						<button onclick={()=>{
							goto(`/private/trips/${ride.id}`)
						}} class="rounded bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
							>VIEW</button
						>
					</div>
				</div>
			</div>
		{/each}
		{:else if data.joined_trips}
{#await data.supabase.from('trips').select('*,destination_location:locations!trips_destination_fkey!inner(*),pickup_location:locations!trips_pickup_point_fkey!inner(*)').eq('id',data.joined_trips.trip_id).single()}
	<p>Loading..</p>
{:then {data:trip_info}} 
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
			<p class="text-sm font-semibold text-gray-800">{trip_info.pickup_location?.name}</p>
			<p class="text-sm text-gray-500">Pickup point</p>
			<p class="mt-2 text-sm font-semibold text-gray-800">
				{trip_info.destination_location?.name}
			</p>
			<p class="text-sm text-gray-500">Destination</p>
		</div>
	</div>

	<!-- Time and Join Button -->
	<div class="flex flex-col justify-between space-y-10">
		<div class="flex w-full flex-row justify-center bg-blue-100 ">
			<p class="w-fit rounded  py-1 text-xs text-right font-bold text-blue-600 px-1">
				{formatHumanReadable(trip_info.departure_time)}
			</p>
		</div>
		<div class="flex flex-row justify-end space-x-2">
			<div class="flex items-center space-x-1 text-gray-700">
				<span class="font-bold flex flex-row gap-1"><div class="flex flex-col justify-end">
					<p class="mt-1">{trip_info.current_passengers}/{trip_info.max_pass}</p>
				</div><div class="flex flex-col justify-center"><LucideCircleUser size='21'/></div></span>
				<span class="text-sm font-bold"></span>
			</div>
			<button onclick={()=>{
				goto(`/private/trips/${trip_info.id}`)
			}} class="rounded bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
				>VIEW</button
			>
		</div>
	</div>
</div>
{/await}

		{:else}
		<p class="text-center bg-gray-100 p-3">Join a trip or make 1</p>
	{/if}
		<p>Other Trips</p>
		{#if trips && trips.length > 0}
			{#each trips as ride}
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
							{#if data.joined_trips?.trip_id===ride.id}
							<p>Joined</p>
							{:else}
							<button onclick={()=>handleUserJoin(ride)} disabled={data.joined_trips?.trip_id===ride.id} class="rounded bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
								>JOIN</button
							>
							{/if}
							
						</div>
					</div>
				</div>
			{/each}
			{:else}
			<p class="text-center bg-gray-100 p-3">No trips right now</p>
		{/if}
	</div>
	<div class="mt-6 flex justify-center">
		{#if data.joined_trips}
		<div
		class="flex flex-row justify-center gap-1 rounded bg-red-200 px-4 py-3 font-bold text-white transition "
	>
		LEAVE CURRENT TRIP FIRST
	</div>
		{:else}
		<a
			href="/private/add-trip"
			class="flex flex-row justify-center gap-1 rounded bg-blue-500 px-4 py-3 font-bold text-white transition hover:bg-blue-600"
		>
			<LucidePlus />
			ADD NEW TRIP
		</a>
		{/if}
		
	</div>
</div>
