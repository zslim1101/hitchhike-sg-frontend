<script lang="ts">
	import type { PageData } from './$types';
	import {
		LucideChevronLeft,
		LucideCircleArrowDown,
		LucideCircleUser,
		LucideMapPin,
		LucideSend,
		LucideStar,
		LucideStarHalf
	} from 'lucide-svelte';
	import { ProgressBar, Ratings } from '@skeletonlabs/skeleton';
	let { data }: { data: PageData } = $props();
	import { goto, invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { page } from '$app/stores';

	let ride = $derived(data.my_trip);

	let trip_id = $page.params.trip_id;
	let messages = writable(data.messages);
	let newMessage = $state('');
	let isLoading = writable(false);

	let reviewvalue = $state(0);

	let isLeavingLoading = $state(false);

	let reviewvalues = $state([0, 0, 0, 0, 0, 0, 0, 0]);

	onMount(() => {
		const messagesChannel = data.supabase
			.channel(`messages:${trip_id}`)
			.on(
				'postgres_changes',
				{ event: 'INSERT', schema: 'public', table: 'messages' },
				(payload) => {
					// fetchMessages();
					messages.set([payload.new, ...$messages]);
				}
			)
			.subscribe();
		return () => {
			data.supabase.removeChannel(messagesChannel);
		};
	});

	onMount(() => {
		const channel = data.supabase
			.channel('public:trips')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'trips' }, (payload) => {
				invalidate('trips:single-trip');
			})
			.subscribe();

		return () => {
			data.supabase.removeChannel(channel);
		};
	});

	// Fetch messages
	async function fetchMessages() {
		const { data: _messages, error } = await data.supabase
			.from('messages')
			.select('*')
			.eq('trip_id', trip_id)
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Error fetching messages:', error);
			return;
		}

		messages.set(_messages);
		isLoading.set(false);
	}

	// Send new message
	async function sendMessage(event) {
		event.preventDefault();
		if (!newMessage.trim()) return;

		if (ride?.status !== 'chat-opened') {
			console.log('dwad');
			const { error: trip_status } = await data.supabase
				.from('trips')
				.update({ status: 'chat-opened' })
				.eq('id', trip_id);

			if (trip_status) {
				console.error('Error updating trip status:', trip_status);
			} else {
				invalidate('trips:single-trip');
			}
		}

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

	const LeaveTrip = async () => {
		isLeavingLoading = true;
		const confirmed = confirm('Are you sure you want to leave this trip?');
		if (!confirmed) {
			isLeavingLoading = false;
			return;
		}
		data.supabase.removeAllChannels();
		const { error: t_pas_error } = await data.supabase
			.from('trip_passengers')
			.delete()
			.eq('trip_id', ride?.id)
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
		isLeavingLoading = false;
	};

	const DeleteTrip = async () => {
		isLeavingLoading = true;
		const confirmed = confirm(
			'Are you sure you want to delete this trip? This action cannot be undone.'
		);
		if (!confirmed) {
			isLeavingLoading = false;
			return;
		}

		data.supabase.removeAllChannels();
		const { error: trip_error } = await data.supabase.from('trips').delete().eq('id', ride?.id);
		if (trip_error) {
		} else {
			goto('/private/trips');
		}
		isLeavingLoading = false;
	};

	const MarkTripComplete = async () => {
		isLeavingLoading = true;
		const confirmed = confirm('Are you sure you want to mark this trip as complete?');
		if (!confirmed) {
			isLeavingLoading = false;
			return;
		}

		const { error: trip_error } = await data.supabase
			.from('trips')
			.update({ status: 'closed' })
			.eq('id', ride?.id);
		if (trip_error) {
		} else {
			const { error: trip_passengers_error, data: trip_passengers } = await data.supabase
				.from('trip_passengers')
				.select('*')
				.eq('trip_id', ride?.id);

			const trip_passengers_user_ids = [
				{ user_id: ride?.created_by, trip_id: ride?.id },
				...trip_passengers.map((tp) => ({
					user_id: tp.user_id,
					trip_id: ride?.id
				}))
			];

			if (trip_passengers_error) {
			} else {
				const { error: review_error } = await data.supabase
					.from('past_trips')
					.insert(trip_passengers_user_ids);
				if (review_error) {
				} else {
					// data.supabase.removeAllChannels();
					// goto('/private/trips');
				}
			}
		}
		isLeavingLoading = false;
	};

	const handleSubmitReview = async (event) => {
		event.preventDefault();

		const formData = new FormData(event.target);
		const rating = Number(formData.get('rating'));
		const comment = formData.get('comment');
		const ride_id = formData.get('ride_id');
		const user_id = formData.get('user_id');

		const { error: review_error } = await data.supabase.from('user_reviews').insert([
			{
				trip_id: ride_id,
				review_for: user_id,
				created_by: data.user?.id,
				rating,
				comment
			}
		]);

		if (review_error) {
			console.error('Error submitting review:', review_error);
		} else {
			invalidate('trips:single-trip');
		}
	};

	const iconClick = reverseDebounce((event: CustomEvent<{ index: number }>) => {
		reviewvalue = event.detail.index;
	}, 100);

	const iconClickss = reverseDebounce((event: CustomEvent<{ index: number }>, arr_index) => {
		reviewvalues[arr_index] = event.detail.index;
	}, 100);

	function reverseDebounce(func, delay) {
		let inCooldown = false;

		return function (...args) {
			if (!inCooldown) {
				func.apply(this, args); // Execute immediately
				inCooldown = true;
				setTimeout(() => {
					inCooldown = false;
				}, delay);
			}
		};
	}

	const handleUserJoin = async (ride) => {
		if (ride?.current_passengers > ride.max_pass) {
			alert('full');
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
				return;
			}
		}
	};

	const kickUser = async (user_id) => {
		const { error } = await data.supabase.from('trip_passengers').delete().eq('user_id', user_id);
		if (error) {
			alert('Fail To Remove');
		} else {
			const { error: updateError } = await data.supabase
				.from('trips')
				.update({ current_passengers: ride?.current_passengers - 1 })
				.eq('id', ride?.id);

			if (updateError) {
				alert('Fail To Remove');
			} else {
				invalidate('trips:single-trip');
			}
		}
	};
</script>

<div class="max-w-4xl mx-auto">
	{#if isLeavingLoading}
		<div class="my-4">
			<ProgressBar meter="bg-orange-400" />
		</div>
	{/if}
	
	<!-- Header Section -->
	<div class="flex justify-between items-center mb-4">
		<a href="/private/trips" class="flex items-center text-gray-700 hover:text-orange-500 transition-colors font-medium">
			<LucideChevronLeft class="mr-1" />
			<span>Return</span>
		</a>
		
		<div class="flex">
			{#if (data.HAS_JOINED_TRIP || ride?.created_by === data.user?.id) && ride?.status !== 'closed'}
				{#if ride?.created_by === data.user?.id}
					<div class="flex flex-col items-end">
						<button
							onclick={DeleteTrip}
							class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
						>
							Cancel Trip
						</button>
						<p class="text-xs text-gray-500 mt-1">Others will be removed</p>
					</div>
				{:else}
					<button
						onclick={LeaveTrip}
						class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
					>
						Leave Trip
					</button>
				{/if}
			{/if}
			
			{#if !data.HAS_JOINED_TRIP && ride?.status !== 'closed' && ride?.created_by !== data.user?.id}
				<button
					onclick={() => handleUserJoin(data.my_trip)}
					disabled={ride?.current_passengers === ride?.max_pass}
					class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm disabled:bg-gray-300 disabled:shadow-none"
				>
					Join Trip
				</button>
			{/if}
		</div>
	</div>

	<!-- Main Trip Card -->
	<div class="bg-white rounded-lg shadow-md overflow-hidden">
		<!-- Trip Status Header -->
		<div class="border-b border-gray-100 p-5">
			<div class="flex justify-between items-center">
				<div class="flex flex-col">
					<div class="flex items-center">
						<span class="text-sm font-medium text-gray-600 mr-2">Status:</span>
						<span
							class={'px-2 py-1 text-xs font-bold uppercase rounded-full ' +
								(ride.status === 'available'
									? 'bg-green-100 text-green-600'
									: ride.status === 'chat-opened'
										? 'bg-orange-100 text-orange-600'
										: 'bg-red-100 text-red-600')}
						>
							{ride.status === 'chat-opened' ? 'Chat Active' : ride.status}
						</span>
					</div>
				</div>
				
				<div class="flex flex-col items-end">
					<div class="bg-orange-50 rounded-full px-3 py-1">
						<p class="text-sm font-medium text-orange-600">
							{formatHumanReadable(ride?.departure_time)}
						</p>
					</div>
				</div>
			</div>
			
			<!-- Trip Route -->
			<div class="flex items-start mt-6 space-x-4">
				<div class="flex flex-col items-center">
					<div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
						<LucideCircleArrowDown size={18} />
					</div>
					<div class="w-0.5 h-10 bg-gray-300 my-1"></div>
					<div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
						<LucideMapPin size={18} />
					</div>
				</div>
				<div class="space-y-6">
					<div>
						<p class="font-medium text-gray-800">{ride?.pickup_location?.name}</p>
						<p class="text-sm text-gray-500">Pickup point</p>
					</div>
					<div>
						<p class="font-medium text-gray-800">{ride?.destination_location?.name}</p>
						<p class="text-sm text-gray-500">Destination</p>
					</div>
				</div>
			</div>
		</div>
		
		<!-- Passenger Info -->
		<div class="px-5 py-3 border-b border-gray-100 flex justify-end">
			<div class="flex items-center space-x-2 bg-orange-50 px-3 py-1 rounded-full">
				<div class="flex items-center">
					<LucideCircleUser size={18} class="text-orange-500" />
					<span class="font-medium text-gray-700 ml-1">{ride?.trip_passengers?.length + 1}/{ride?.max_pass}</span>
				</div>
				<span class="text-sm text-gray-600">Riders</span>
			</div>
		</div>

		{#if ride?.status !== 'closed'}
			<!-- Passengers List -->
			<div class="p-5">
				<h2 class="text-lg font-semibold text-gray-800 mb-3">Passengers</h2>
				<ul class="space-y-3">
					<li class="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm">
						<div class="flex items-center justify-between">
							<div>
								{#await data.supabase
									.from('profiles')
									.select('*')
									.eq('id', ride?.created_by)
									.single()}
									<div class="animate-pulse h-5 w-32 bg-gray-200 rounded"></div>
								{:then { data: owner }}
									<a
										href="/private/profile/{ride?.created_by}"
										class="font-medium text-gray-800 hover:text-orange-500"
									>
										{owner.name} <span class="text-orange-500 font-medium">(Owner)</span>
									</a>
								{/await}
							</div>
							<div>
								{#await data.supabase
									.from('user_reviews')
									.select('*')
									.eq('review_for', ride?.created_by)}
									<div class="animate-pulse h-5 w-24 bg-gray-200 rounded"></div>
								{:then { data: reviews }}
									{#if reviews.length === 0}
										<span class="text-sm text-gray-500">No reviews yet</span>
									{:else}
										<div class="flex items-center">
											<span class="text-sm text-gray-600 mr-1">Rating:</span>
											<span class="text-orange-500 font-medium">
												{(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)}
											</span>
										</div>
									{/if}
								{/await}
							</div>
						</div>
					</li>
					
					{#each ride?.trip_passengers as passenger}
						<li class="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm">
							<div class="flex items-center justify-between">
								<a
									href="/private/profile/{passenger?.user_id}"
									class="font-medium text-gray-800 hover:text-orange-500"
								>
									{passenger?.name}
								</a>
								<div class="flex items-center space-x-4">
									{#if passenger?.user_id !== data.user?.id && ride?.created_by === data.user?.id}
										<button
											class="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
											onclick={() => kickUser(passenger?.user_id)}
										>
											Kick
										</button>
									{/if}
									{#await data.supabase
										.from('user_reviews')
										.select('*')
										.eq('review_for', passenger?.user_id)}
										<div class="animate-pulse h-5 w-24 bg-gray-200 rounded"></div>
									{:then { data: reviews }}
										{#if reviews.length === 0}
											<span class="text-sm text-gray-500">No reviews yet</span>
										{:else}
											<div class="flex items-center">
												<span class="text-sm text-gray-600 mr-1">Rating:</span>
												<span class="text-orange-500 font-medium">
													{(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)}
												</span>
											</div>
										{/if}
									{/await}
								</div>
							</div>
						</li>
					{/each}
				</ul>
			</div>

			{#if ride?.created_by === data.user?.id}
				<div class="p-5 border-t border-gray-100">
					<button
						onclick={MarkTripComplete}
						class="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm font-medium"
					>
						Mark Trip Complete
					</button>
					<p class="text-xs text-center text-gray-500 mt-2">
						This will close the chat and mark the trip as complete
					</p>
				</div>
			{/if}
		{/if}

		{#if ride?.status === 'closed'}
			<!-- Reviews Section -->
			<div class="p-5">
				<h2 class="text-xl font-semibold text-gray-800 mb-4">Review Users</h2>
				<ul class="space-y-8">
					<li>
						{#await data.supabase.from('profiles').select('*').eq('id', ride?.created_by).single()}
							<div class="animate-pulse h-6 w-40 bg-gray-200 rounded mb-3"></div>
						{:then { data: owner }}
							<a 
								class="text-lg font-medium text-gray-800 hover:text-orange-500" 
								href="/private/profile/{ride?.created_by}"
							>
								{owner?.name} <span class="text-orange-500">(Owner)</span>
							</a>
						{/await}

						{#await data.supabase
							.from('user_reviews')
							.select('*')
							.eq('review_for', ride?.created_by)
							.eq('created_by', data.user?.id)
							.eq('trip_id', ride?.id)
							.single()}
							<div class="animate-pulse h-32 w-full bg-gray-200 rounded mt-2"></div>
						{:then { data: exists }}
							{#if exists}
								<div class="mt-3 p-4 rounded-lg border border-orange-200 bg-orange-50">
									<p class="font-medium text-gray-700 mb-2">Your review:</p>
									<Ratings value={exists?.rating || 0} max={5} min={1}>
										<svelte:fragment slot="empty"><LucideStar class="text-gray-300" /></svelte:fragment>
										<svelte:fragment slot="half"><LucideStarHalf class="text-yellow-400" /></svelte:fragment>
										<svelte:fragment slot="full"><LucideStar class="text-yellow-400" /></svelte:fragment>
									</Ratings>
									<p class="mt-2 text-gray-700">{exists.comment}</p>
								</div>
							{:else if data.user?.id === ride?.created_by}
								<div></div>
							{:else}
								<form onsubmit={handleSubmitReview} class="mt-3">
									<div class="p-4 rounded-lg border border-orange-200 bg-white shadow-sm">
										<span class="block font-medium text-gray-700 mb-3">Create your review:</span>
										<input type="hidden" name="ride_id" value={ride?.id} />
										<input type="hidden" name="user_id" value={ride?.created_by} />
										
										<div class="mb-3">
											<input type="hidden" name="rating" bind:value={reviewvalue} />
											<Ratings
												bind:value={reviewvalue}
												max={5}
												min={1}
												interactive
												on:icon={iconClick}
											>
												<svelte:fragment slot="empty"><LucideStar class="text-gray-300" size={24} /></svelte:fragment>
												<svelte:fragment slot="half"><LucideStarHalf class="text-yellow-400" size={24} /></svelte:fragment>
												<svelte:fragment slot="full"><LucideStar class="text-yellow-400" size={24} /></svelte:fragment>
											</Ratings>
										</div>
										
										<div class="mb-3">
											<textarea
												name="comment"
												class="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-300 outline-none transition"
												placeholder="Type your review here..."
												rows="4"
											></textarea>
										</div>

										<button
											type="submit"
											class="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
										>
											Submit Review
										</button>
									</div>
								</form>
							{/if}
						{/await}
					</li>
					
					{#each ride?.trip_passengers as passenger}
						<li>
							<a 
								href="/private/profile/{passenger?.user_id}" 
								class="text-lg font-medium text-gray-800 hover:text-orange-500"
							>
								{passenger?.name}
							</a>
							
							{#await data.supabase
								.from('user_reviews')
								.select('*')
								.eq('review_for', passenger?.user_id)
								.eq('created_by', data.user?.id)
								.eq('trip_id', ride?.id)
								.single()}
								<div class="animate-pulse h-32 w-full bg-gray-200 rounded mt-2"></div>
							{:then { data: exists }}
								{#if exists}
									<div class="mt-3 p-4 rounded-lg border border-orange-200 bg-orange-50">
										<p class="font-medium text-gray-700 mb-2">Your review:</p>
										<Ratings value={exists?.rating || 0} max={5} min={1}>
											<svelte:fragment slot="empty"><LucideStar class="text-gray-300" /></svelte:fragment>
											<svelte:fragment slot="half"><LucideStarHalf class="text-yellow-400" /></svelte:fragment>
											<svelte:fragment slot="full"><LucideStar class="text-yellow-400" /></svelte:fragment>
										</Ratings>
										<p class="mt-2 text-gray-700">{exists.comment}</p>
									</div>
								{:else if data.user?.id === passenger?.user_id}
									<div></div>
								{:else}
									<form onsubmit={handleSubmitReview} class="mt-3">
										<div class="p-4 rounded-lg border border-orange-200 bg-white shadow-sm">
											<span class="block font-medium text-gray-700 mb-3">Create your review:</span>
											<input type="hidden" name="ride_id" value={ride?.id} />
											<input type="hidden" name="user_id" value={passenger?.user_id} />
											
											<div class="mb-3">
												<input type="hidden" name="rating" bind:value={reviewvalue} />
												<Ratings
													bind:value={reviewvalue}
													max={5}
													min={1}
													interactive
													on:icon={iconClick}
												>
													<svelte:fragment slot="empty"><LucideStar class="text-gray-300" size={24} /></svelte:fragment>
													<svelte:fragment slot="half"><LucideStarHalf class="text-yellow-400" size={24} /></svelte:fragment>
													<svelte:fragment slot="full"><LucideStar class="text-yellow-400" size={24} /></svelte:fragment>
												</Ratings>
											</div>
											
											<div class="mb-3">
												<textarea
													name="comment"
													class="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-300 outline-none transition"
													placeholder="Type your review here..."
													rows="4"
												></textarea>
											</div>

											<button
												type="submit"
												class="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
											>
												Submit Review
											</button>
										</div>
									</form>
								{/if}
							{/await}
						</li>
					{/each}
				</ul>
			</div>
		{:else if data.HAS_JOINED_TRIP || ride?.created_by === data.user?.id}
			<!-- Chat Section -->
			<div class="p-5 border-t border-gray-100">
				<h2 class="text-xl font-semibold text-gray-800 mb-4 text-center">Instant Chat</h2>

				{#if $isLoading}
					<div class="flex justify-center py-8">
						<div class="animate-pulse flex space-x-2">
							<div class="h-3 w-3 bg-orange-300 rounded-full"></div>
							<div class="h-3 w-3 bg-orange-300 rounded-full"></div>
							<div class="h-3 w-3 bg-orange-300 rounded-full"></div>
						</div>
					</div>
				{:else}
					<!-- Message Display Area -->
					<div class="bg-gray-50 rounded-lg border border-gray-200 h-72 overflow-y-auto p-4 mb-4">
						{#if $messages.length === 0}
							<div class="flex justify-center items-center h-full">
								<p class="text-gray-500">Start the conversation here</p>
							</div>
						{:else}
							<div class="flex flex-col-reverse space-y-reverse space-y-3">
								{#each $messages as { content, created_at, user_id, name }}
									{#if user_id === data.user?.id}
										<!-- User Message -->
										<div class="flex flex-col items-end">
											<div class="flex items-center mb-1">
												<span class="text-xs text-gray-400 mr-2">
													{new Date(created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
												</span>
												<span class="text-sm font-medium text-orange-600">You</span>
											</div>
											<div class="max-w-xs sm:max-w-sm bg-orange-100 text-gray-800 rounded-lg rounded-tr-none px-4 py-2 border-l-4 border-orange-400 shadow-sm">
												<p class="break-words">{content}</p>
											</div>
										</div>
									{:else}
										<!-- Other User Message -->
										<div class="flex flex-col items-start">
											<div class="flex items-center mb-1">
												<span class="text-sm font-medium text-gray-700 capitalize">{name}</span>
												<span class="text-xs text-gray-400 ml-2">
													{new Date(created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
												</span>
											</div>
											<div class="max-w-xs sm:max-w-sm bg-white text-gray-800 rounded-lg rounded-tl-none px-4 py-2 border-l-4 border-gray-300 shadow-sm">
												<p class="break-words">{content}</p>
											</div>
										</div>
									{/if}
								{/each}
							</div>
						{/if}
					</div>

					<!-- Message Input Area -->
					<form onsubmit={sendMessage} class="space-y-3">
						<div class="relative">
							<input
								bind:value={newMessage}
								placeholder="Type your message..."
								class="w-full py-3 px-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-300 outline-none transition pr-12"
								type="text"
							/>
							<button
								type="submit"
								class="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors disabled:bg-gray-300"
							>
								<LucideSend size={16} />
							</button>
						</div>
					</form>
				{/if}
			</div>
		{/if}
	</div>
</div>