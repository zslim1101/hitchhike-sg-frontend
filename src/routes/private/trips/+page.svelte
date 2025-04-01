<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { onDestroy, onMount } from 'svelte';
	import {
		LucideCircleArrowDown,
		LucideCircleUser,
		LucideHistory,
		LucideMapPin,
		LucidePlus,
		LucideMessageCircle,
		LucideX,
		LucideUsers,
		LucideSend,
		LucideFrown
	} from 'lucide-svelte';
	import { writable } from 'svelte/store';

	let { data } = $props();

	const trips = $derived(data.trips);
	const my_trips = $derived(data.my_trips);

	let isjoiningaTrip = $state(false);
	let messagesContainer;
	let isChatOpen = $state(false);
	let unreadCount = $state(0);

	let messages = writable(data.messages);

	onMount(() => {
		const messagesChannel = data.supabase
			.channel(`messages:lobby`)
			.on(
				'postgres_changes',
				{ event: 'INSERT', schema: 'public', table: 'messages_lobby' },
				(payload) => {
					messages.set([...$messages, payload.new]);
						// Increment unread count if chat is closed
						if (!isChatOpen) {
						unreadCount++;
					}

					// Scroll to bottom if chat is open
					if (isChatOpen) {
						scrollToBottom();
					}
				}
			)
			.subscribe();
		return () => {
			data.supabase.removeChannel(messagesChannel);
		};
	});

	onMount(() => {
		const onlineUsersChannel = data.supabase
			.channel(`online_users`)
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'online_users' },
				(payload) => {
					fetchOnlineUsers();
				}
			)
			.subscribe();
		return () => {
			data.supabase.removeChannel(onlineUsersChannel);
		};
	});

	//on mount add user to online users
	onMount(async () => {
		await data.supabase.from('online_users').insert({
			user_id: data.user?.id,
			name: data.user?.user_metadata.name
		});
		fetchOnlineUsers();
	});

	//on leave remove user from online users
	onDestroy(async () => {
		await data.supabase.from('online_users').delete().eq('user_id', data.user?.id);
	});

	const fetchOnlineUsers = async () => {
		const { data: online_users } = await data.supabase.from('online_users').select('*');
		onlineUsers = online_users;
	};

	// Dummy online users for the chat feature
	let onlineUsers = $state(data.online_users);

	let newMessage = $state('');

	async function sendMessage() {
		if (!newMessage.trim()) return;

		const { error } = await data.supabase.from('messages_lobby').insert([
			{
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
		scrollToBottom();
	}

	// Function to toggle chat and reset unread count
	function toggleChat() {
		isChatOpen = !isChatOpen;

		if (isChatOpen) {
			unreadCount = 0;
			// Scroll to bottom when opening chat
			scrollToBottom();
		}
	}

	// Scroll to bottom function
	function scrollToBottom() {
		if (messagesContainer) {
			setTimeout(() => {
				messagesContainer.scrollTop = messagesContainer.scrollHeight;
			}, 50);
		}
	}

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
			alert('This trip is already full');
			isjoiningaTrip = false;
			return;
		}

		const { error } = await data.supabase.from('trip_passengers').insert({
			trip_id: ride.id,
			user_id: data.user?.id,
			name: data.user?.user_metadata.name
		});

		if (error) {
			alert('You have already joined this trip');
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
				alert('This trip is now full');
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

<div class="mx-auto max-w-4xl px-4 py-6">
	<!-- Loading indicator -->
	{#if isjoiningaTrip}
		<div class="fixed inset-x-0 top-0 z-50 h-1 bg-orange-100">
			<div class="h-full animate-pulse bg-orange-500" style="width: 100%"></div>
		</div>
	{/if}

	<!-- Page header -->
	<header class="mb-6">
		<h1 class="text-2xl font-bold text-gray-800">My Carpools</h1>
		<p class="text-sm text-gray-500">Find or create rides to share your journey</p>
	</header>

	<div class="space-y-6">
		<!-- Section My Trips -->
		<section class="rounded-lg bg-white p-6 shadow-sm">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-lg font-semibold text-gray-800">Current Trip</h2>
				<a
					href="/private/add-trip"
					class="flex items-center gap-1 rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
				>
					<LucidePlus size={16} />
					Create a Trip
				</a>
			</div>

			<!-- My trips -->
			{#if my_trips && my_trips.length > 0}
				<div class="space-y-4">
					{#each my_trips as ride}
						<div
							class="overflow-hidden rounded-lg border border-l-4 border-l-orange-500 bg-white p-4 shadow-sm transition hover:shadow-md"
						>
							<!-- Status bar -->
							<div class="mb-3 flex items-center justify-between">
								<div class="flex items-center gap-2">
									<span class="text-sm font-medium text-gray-600">Status:</span>
									<span
										class={'rounded-full px-2 py-0.5 text-xs font-bold uppercase ' +
											(ride.status === 'available'
												? 'bg-green-100 text-green-800'
												: ride.status === 'chat-opened'
													? 'bg-orange-100 text-orange-800'
													: 'bg-red-100 text-red-800')}
									>
										{ride.status === 'chat-opened' ? 'Chat Active' : ride.status}
									</span>
								</div>
								<div
									class="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-800"
								>
									{formatHumanReadable(ride?.departure_time)}
								</div>
							</div>

							<!-- Trip details -->
							<div class="flex flex-wrap items-center justify-between gap-4">
								<!-- Pickup and Destination Points -->
								<div class="flex items-start gap-3 sm:min-w-80">
									<div class="flex flex-col items-center">
										<div
											class="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-500"
										>
											<LucideCircleArrowDown size={16} />
										</div>
										<div class="my-1 h-10 w-0.5 bg-gray-200"></div>
										<div
											class="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-500"
										>
											<LucideMapPin size={16} />
										</div>
									</div>
									<div>
										<div class="mb-3">
											<p class="font-medium text-gray-800">{ride.pickup_location?.name}</p>
											<p class="text-sm text-gray-500">Pickup point</p>
										</div>
										<div>
											<p class="font-medium text-gray-800">{ride.destination_location?.name}</p>
											<p class="text-sm text-gray-500">Destination</p>
										</div>
									</div>
								</div>

								<!-- Time and Join Button -->
								<div class="flex items-center gap-4">
									<div
										class="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 text-gray-700"
									>
										<span class="text-sm font-medium"
											>{ride.current_passengers}/{ride.max_pass}</span
										>
										<LucideCircleUser size={18} class="text-gray-500" />
									</div>

									<button
										onclick={() => {
											goto(`/private/trips/${ride.id}`);
										}}
										class="rounded-full bg-orange-500 px-6 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
									>
										VIEW DETAILS
									</button>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}

			{#if data.joined_trips && data.joined_trips.length > 0}
				<div class="mt-4 space-y-4">
					{#each data.joined_trips as joinedtrip}
						<div
							class="overflow-hidden rounded-lg border border-l-4 border-l-yellow-500 bg-white p-4 shadow-sm transition hover:shadow-md"
						>
							<!-- Status bar -->
							<div class="mb-3 flex items-center justify-between">
								<div class="flex items-center gap-2">
									<span class="text-sm font-medium text-gray-600">Status:</span>
									<span
										class={'rounded-full px-2 py-0.5 text-xs font-bold uppercase ' +
											(joinedtrip.trips.status === 'available'
												? 'bg-green-100 text-green-800'
												: joinedtrip.trips.status === 'chat-opened'
													? 'bg-orange-100 text-orange-800'
													: 'bg-red-100 text-red-800')}
									>
										{joinedtrip.trips.status === 'chat-opened'
											? 'Chat Active'
											: joinedtrip.trips.status}
									</span>
								</div>
								<div
									class="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-800"
								>
									{formatHumanReadable(joinedtrip.trips?.departure_time)}
								</div>
							</div>

							<!-- Trip details -->
							<div class="flex flex-wrap items-center justify-between gap-4">
								<!-- Pickup and Destination Points -->
								<div class="flex items-start gap-3 sm:min-w-80">
									<div class="flex flex-col items-center">
										<div
											class="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 text-yellow-500"
										>
											<LucideCircleArrowDown size={16} />
										</div>
										<div class="my-1 h-10 w-0.5 bg-gray-200"></div>
										<div
											class="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 text-yellow-500"
										>
											<LucideMapPin size={16} />
										</div>
									</div>
									<div>
										<div class="mb-3">
											<p class="font-medium text-gray-800">
												{joinedtrip.trips.pickup_location?.name}
											</p>
											<p class="text-sm text-gray-500">Pickup point</p>
										</div>
										<div>
											<p class="font-medium text-gray-800">
												{joinedtrip.trips.destination_location?.name}
											</p>
											<p class="text-sm text-gray-500">Destination</p>
										</div>
									</div>
								</div>

								<!-- Time and Join Button -->
								<div class="flex items-center gap-4">
									<div
										class="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 text-gray-700"
									>
										<span class="text-sm font-medium"
											>{joinedtrip.trips.current_passengers}/{joinedtrip.trips.max_pass}</span
										>
										<LucideCircleUser size={18} class="text-gray-500" />
									</div>

									<button
										onclick={() => {
											goto(`/private/trips/${joinedtrip.trips.id}`);
										}}
										class="rounded-full bg-yellow-500 px-6 py-2 text-sm font-medium text-white transition hover:bg-yellow-600"
									>
										VIEW DETAILS
									</button>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}

			{#if (!my_trips || my_trips.length === 0) && (!data.joined_trips || data.joined_trips.length === 0)}
				<div
					class="flex flex-col items-center justify-center rounded-lg bg-gray-50 py-8 text-center"
				>
					<LucideFrown />
					<p class="mb-2 text-lg font-semibold text-gray-700">You currently have no trips</p>
					<p class="mb-4 text-sm text-gray-500">Either join an existing trip or create a new one</p>
					<a
						href="/private/add-trip"
						class="flex items-center gap-1 rounded-full bg-orange-500 px-6 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
					>
						<LucidePlus size={16} />
						Create a Trip
					</a>
				</div>
			{/if}
		</section>

		<!-- Section Available Trips -->
		<section class="rounded-lg bg-white p-6 shadow-sm">
			<h2 class="mb-4 text-lg font-semibold text-gray-800">Available Trips</h2>

			{#if trips && trips.length > 0}
				<div class="space-y-4">
					{#each trips as ride}
						{#if !data.joined_trips?.some((trip) => trip.trip_id === ride.id)}
							<div
								class="overflow-hidden rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md"
							>
								<!-- Status bar -->
								<div class="mb-3 flex items-center justify-between">
									<div class="flex items-center gap-2">
										<span class="text-sm font-medium text-gray-600">Status:</span>
										<span
											class={'rounded-full px-2 py-0.5 text-xs font-bold uppercase ' +
												(ride.status === 'available'
													? 'bg-green-100 text-green-800'
													: ride.status === 'chat-opened'
														? 'bg-orange-100 text-orange-800'
														: 'bg-red-100 text-red-800')}
										>
											{ride.status === 'chat-opened' ? 'Chat Active' : ride.status}
										</span>
									</div>
									<div
										class="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-800"
									>
										{formatHumanReadable(ride?.departure_time)}
									</div>
								</div>

								<!-- Trip details -->
								<div class="flex flex-wrap items-center justify-between gap-4">
									<!-- Pickup and Destination Points -->
									<div class="flex items-start gap-3 sm:min-w-80">
										<div class="flex flex-col items-center">
											<div
												class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500"
											>
												<LucideCircleArrowDown size={16} />
											</div>
											<div class="my-1 h-10 w-0.5 bg-gray-200"></div>
											<div
												class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500"
											>
												<LucideMapPin size={16} />
											</div>
										</div>
										<div>
											<div class="mb-3">
												<p class="font-medium text-gray-800">{ride.pickup_location?.name}</p>
												<p class="text-sm text-gray-500">Pickup point</p>
											</div>
											<div>
												<p class="font-medium text-gray-800">{ride.destination_location?.name}</p>
												<p class="text-sm text-gray-500">Destination</p>
											</div>
										</div>
									</div>

									<!-- Passenger count and action buttons -->
									<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
										<div
											class="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 text-gray-700"
										>
											<span class="text-sm font-medium"
												>{ride.current_passengers}/{ride.max_pass}</span
											>
											<LucideCircleUser size={18} class="text-gray-500" />
										</div>

										<div class="flex gap-2">
											<button
												onclick={() => {
													goto(`/private/trips/${ride.id}`);
												}}
												class="rounded-full bg-gray-100 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
											>
												VIEW
											</button>

											<button
												onclick={async () => {
													await handleUserJoin(ride);
												}}
												disabled={ride.current_passengers === ride.max_pass}
												class="rounded-full bg-orange-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300"
											>
												{ride.current_passengers === ride.max_pass ? 'FULL' : 'JOIN'}
											</button>
										</div>
									</div>
								</div>
							</div>
						{/if}
					{/each}
				</div>
			{:else}
				<div class="rounded-lg bg-gray-50 p-6 text-center">
					<p class="text-sm text-gray-500">No available trips at the moment.</p>
				</div>
			{/if}
		</section>
	</div>

	<!-- Past trips link -->
	<div class="mt-8 flex justify-center">
		<a
			href="/private/past-trips"
			class="flex items-center gap-1.5 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-200"
		>
			<LucideHistory size={16} />
			View Past Trips
		</a>
	</div>

	<!-- Floating chat button with notification badge -->
	<button
		onclick={toggleChat}
		class="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
	>
		{#if isChatOpen}
			<LucideX size={24} />
		{:else}
			<LucideMessageCircle size={24} />

			<!-- Notification badge -->
			{#if unreadCount > 0}
				<div
					class="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-yellow-500 text-xs font-bold text-white"
				>
					{unreadCount > 9 ? '9+' : unreadCount}
				</div>
			{/if}
		{/if}
	</button>

	<!-- Chat window -->
	{#if isChatOpen}
		<div
			class="fixed bottom-24 right-6 z-50 flex w-80 flex-col overflow-hidden rounded-lg bg-white shadow-xl sm:w-96"
		>
			<!-- Chat header -->
			<div class="flex items-center justify-between bg-orange-500 px-4 py-3 text-white">
				<div class="flex items-center gap-2">
					<LucideUsers size={18} />
					<h3 class="text-sm font-medium">Community Chat</h3>
					<span class="rounded-full bg-white px-1.5 py-0.5 text-xs font-semibold text-orange-500"
						>{onlineUsers.filter((u) => u.status === 'Online').length}</span
					>
				</div>
				<button onclick={() => (isChatOpen = false)} class="text-white hover:text-orange-100">
					<LucideX size={18} />
				</button>
			</div>

			<!-- Online users -->
			<div class="border-b bg-gray-50 px-4 py-2">
				<p class="mb-1 text-xs text-gray-500">Online users</p>
				<div class="flex gap-2 overflow-x-auto pb-1">
					{#each onlineUsers as user}
						<div class="relative flex-shrink-0">
							<div class="group flex items-center rounded-full text-sm focus:outline-none">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-yellow-300 font-medium uppercase text-white"
								>
									{user?.name
										? user.name
												.split(' ')
												.map((n) => n[0])
												.join('')
												.slice(0, 3)
										: '??'}
								</div>
							</div>
							<span
								class={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-white ${user.status === 'Online' ? 'bg-green-500' : 'bg-yellow-500'}`}
							></span>
						</div>
					{/each}
				</div>
			</div>

			<!-- Chat messages with bind:this for scrolling -->
			<div
				bind:this={messagesContainer}
				class="flex-1 overflow-y-auto p-3"
				style="max-height: 300px;"
			>
				{#each $messages as message}
					<div class="mb-3">
						<div class="flex items-baseline gap-1.5">
							<span class="font-medium">{message.name}</span>
							<span class="text-xs text-gray-400">{formatHumanReadable(message.created_at)}</span>
						</div>
						<p class="rounded-lg bg-gray-100 p-2 text-sm text-gray-800">{message.content}</p>
					</div>
				{/each}
			</div>

			<!-- Chat input -->
			<div class="border-t p-3">
				<div class="flex items-center gap-2">
					<input
						type="text"
						bind:value={newMessage}
						placeholder="Type a message..."
						class="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
						onkeydown={(e) => e.key === 'Enter' && sendMessage()}
					/>
					<button
						onclick={sendMessage}
						class="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white transition hover:bg-orange-600"
					>
						<LucideSend size={18} />
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
