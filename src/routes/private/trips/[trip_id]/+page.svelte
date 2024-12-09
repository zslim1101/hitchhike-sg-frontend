<script lang="ts">
	import type { PageData } from './$types';
	import { LucideCircleArrowDown, LucideCircleUser, LucideMapPin, LucidePlus } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { page } from '$app/stores';

	let ride = data.my_trip;

	let trip_id = $page.params.trip_id;
	let messages = writable(data.messages);
	let newMessage = $state('');
	let isLoading = writable(false);

	onMount(() => {
		const messagesChannel = data.supabase
			.channel('messages')
			.on(
				'postgres_changes',
				{ event: 'INSERT', schema: 'public', table: 'messages' },
				(payload) => {
					fetchMessages();
				}
			)
			.subscribe();
		return () => {
			messagesChannel.unsubscribe();
		};
	});

	// Fetch messages
	async function fetchMessages() {
		const { data: _messages, error } = await data.supabase
			.from('messages')
			.select('*')
			.eq('trip_id', trip_id)
			.order('created_at', { ascending: true });

		if (error) {
			console.error('Error fetching messages:', error);
			return;
		}

		messages.set(_messages);
		isLoading.set(false);
	}

	// Send new message
	async function sendMessage() {
		if (!newMessage.trim()) return;

		const { error } = await data.supabase.from('messages').insert([
			{
				trip_id,
				name: data.user?.user_metadata.name,
				user_id: data.user?.id,
				content: newMessage
			}
		]);

		if (error) {
			console.error('Error sending message:', error);
			return;
		}

		newMessage = ''; // Reset message input after sending
		fetchMessages(); // Refresh the messages
	}

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
					<p class="text-sm font-semibold text-gray-800">{ride?.pickup_location?.name}</p>
					<p class="text-sm text-gray-500">Pickup point</p>
					<p class="mt-2 text-sm font-semibold text-gray-800">
						{ride?.destination_location?.name}
					</p>
					<p class="text-sm text-gray-500">Destination</p>
				</div>
			</div>

			<!-- Time and Join Button -->
			<div class="flex flex-col justify-start">
				<div class="flex w-full flex-row justify-center bg-blue-100">
					<p class="w-fit rounded px-1 py-1 text-right text-xs font-bold text-blue-600">
						{formatHumanReadable(ride?.departure_time)}
					</p>
				</div>
			</div>
		</div>
		<div class="flex flex-col space-y-4">
			<div class="flex flex-row justify-end space-x-2">
				<div class="flex items-center space-x-1 text-gray-700">
					<span class="flex flex-row gap-1 font-bold">
						<div class="flex flex-col justify-end">
							<p class="mt-1">{ride?.trip_passengers?.length + 1}/{ride?.max_pass}</p>
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

		<div>
			<div class="mx-auto max-w-4xl space-y-4 p-4">
				<h2 class="text-center text-2xl font-semibold text-gray-800">
					Instant Chat
				</h2>
			
				{#if $isLoading}
					<p class="text-center text-gray-500">Loading messages...</p>
				{:else}
					<!-- Message Display Area -->
					<div class="max-h-96 space-y-4 overflow-y-auto rounded-lg bg-gray-50 p-4 shadow-md">
						{#each $messages as { content, created_at, user_id, name }}
							<div class="rounded-lg  p-3 {user_id === data.user?.id ? 'bg-blue-100' : 'bg-white'} shadow-sm" >
								<div class="mb-2 flex items-center justify-between">
									<span class="text-sm font-semibold   text-gray-700">{name}</span>
									<span class="text-xs text-gray-500">{new Date(created_at).toLocaleTimeString()}</span>
								</div>
								<p class="text-gray-800">{content}</p>
							</div>
						{/each}
					</div>
				{/if}
			
				<!-- Message Input Area -->
				<div class="flex flex-col space-y-2 ">
					<textarea
						bind:value={newMessage}
						placeholder="Type your message..."
						rows="4"
						class="resize-none rounded-lg border-2 border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
					></textarea>
					<button
						onclick={sendMessage}
						class="rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
					>
						Send
					</button>
				</div>
			</div>
		</div>

	</div>

	


</div>
