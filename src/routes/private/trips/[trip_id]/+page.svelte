<script lang="ts">
	import type { PageData } from './$types';
	import { LucideCircleArrowDown, LucideCircleUser, LucideMapPin, LucidePlus } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();
	import { goto } from '$app/navigation';

	let ride = data.my_trip;

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

	console.log(ride);

	const adjectives = ['Creative', 'Mighty', 'Brave', 'Silent', 'Loyal', 'Dynamic'];
	const animals = ['Tigers', 'Wolves', 'Eagles', 'Dragons', 'Sharks', 'Lions'];
	const objects = ['Force', 'Squad', 'Alliance', 'Crew', 'Legends', 'Pack'];

	function generateRandomGroupName() {
		const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
		const animal = animals[Math.floor(Math.random() * animals.length)];
		const object = objects[Math.floor(Math.random() * objects.length)];
		return `${adjective} ${animal} ${object}`;
	}

	async function startTrip() {
	if (confirm('Are you sure?')) {
		try {
			// Create chatroom
			const { data: chatrooms, error: chatroomError } = await data.supabase
				.from('chatrooms')
				.insert({ name: generateRandomGroupName() })
				.select('*')
				.single();

			if (chatroomError) {
				throw new Error(`Error creating chatroom: ${chatroomError.message}`);
			}

			// Add chatroom members
			const { error: membersError } = await data.supabase.from('chatroom_members').insert([
				{ chatroom_id: chatrooms?.id, user_id: ride?.created_by },
				...ride?.trip_passengers?.map((passenger) => ({
					chatroom_id: chatrooms?.id,
					user_id: passenger?.user_id
				}))
			]);

			if (membersError) {
				throw new Error(`Error adding chatroom members: ${membersError.message}`);
			}

			// Proceed to the next step (goto)
			goto(`/private/chatroom/${chatrooms.id}`); // Replace with your actual goto logic
		} catch (error) {
			console.error(error.message);
			// Handle any additional error display or logic here
		}
	} else {
		// Handle the cancel case here if needed
	}
}


	const LeaveTrip = async () => {
		const { error: t_pas_error } = await data.supabase
			.from('trip_passengers')
			.delete()
			.eq('user_id', data.user.id);

		if (t_pas_error) {
		} else {
			const { error: trip_error } = await data.supabase
				.from('trips')
				.update({ current_passengers: ride?.current_passengers - 1 })
				.eq('id', ride?.id);
			if (trip_error) {
			} else {
				goto('/private/trips');
			}
		}
	};

	const DeleteTrip = async () => {
		const { error: trip_error } = await data.supabase.from('trips').delete().eq('id', ride?.id);
		if (trip_error) {
		} else {
			goto('/private/trips');
		}
	};
</script>

<div class="space-y-4">
	<div class="   container m-1 mx-auto w-full bg-white p-4 shadow">
		<div class="flex flex-row items-center justify-between rounded-lg">
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
			<div class="flex flex-col justify-start">
				<div class="flex w-full flex-row justify-center bg-blue-100">
					<p class="w-fit rounded px-1 py-1 text-right text-xs font-bold text-blue-600">
						{formatHumanReadable(ride.departure_time)}
					</p>
				</div>
			</div>
		</div>
		<div class="flex flex-col space-y-4">
			<div class="flex flex-row justify-end space-x-2">
				<div class="flex items-center space-x-1 text-gray-700">
					<span class="flex flex-row gap-1 font-bold">
						<div class="flex flex-col justify-end">
							<p class="mt-1">{ride?.trip_passengers.length + 1}/{ride?.max_pass}</p>
						</div>
						<div class="flex flex-col justify-center">
							<LucideCircleUser size="21" />
						</div>
					</span>
					<span class="text-sm font-bold">Riders</span>
				</div>
			</div>

			<!-- List of passengers -->
			<div class="flex flex-col space-y-2">
				<h2 class="text-lg font-bold">Passengers:</h2>
				<ul class="ml-4 list-disc">
					<li>Owner</li>
					{#each ride?.trip_passengers as passenger}
						<li>{passenger?.name} (Joined: {new Date(passenger.joined_at).toLocaleString()})</li>
					{/each}
				</ul>
			</div>

			<!-- Show button to start the trip if conditions are met -->
			{#if ride?.trip_passengers.length + 1 >= ride?.min_pass}
				<button
					onclick={startTrip}
					class="rounded bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
				>
					Start Trip
				</button>
			{:else}
				<p class="font-bold text-red-500">
					At least {ride?.min_pass} passenger(s) needed to start the trip!
				</p>
			{/if}
		</div>
		<div class="mt-10">
			{#if ride?.created_by === data.user?.id}
				<button
					onclick={DeleteTrip}
					class="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700">Delete</button
				>
			{:else}
				<button onclick={LeaveTrip} class="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
					>Leave</button
				>
			{/if}
		</div>
	</div>
</div>
