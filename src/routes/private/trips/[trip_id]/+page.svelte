<script lang="ts">
	import type { PageData } from './$types';
	import {
		LucideChevronLeft,
		LucideCircleArrowDown,
		LucideCircleUser,
		LucideMapPin,
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

<div>
	{#if isLeavingLoading}
		<ProgressBar meter="bg-secondary-600" />
	{/if}
	<div class="mb-1 flex flex-row justify-between">
		<div class="flex flex-col justify-center">
			<a href="/private/trips" class="flex w-fit flex-row pr-3">
				<LucideChevronLeft />
				Return</a
			>
		</div>
		{#if (data.HAS_JOINED_TRIP || ride?.created_by === data.user?.id) && ride?.status !== 'closed'}
			<div class="flex flex-col items-center">
				{#if ride?.created_by === data.user?.id}
					<button
						onclick={DeleteTrip}
						class="text-nowrap rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
						>Cancel Trip</button
					>
					<p class="px-1 text-xs">Others will be removed</p>
				{:else}
					<button
						onclick={LeaveTrip}
						class="mr-2 text-nowrap rounded bg-red-500 px-4 py-2 text-white hover:bg-red-500"
						>Leave Trip</button
					>
				{/if}
			</div>
		{/if}
		{#if !data.HAS_JOINED_TRIP && ride?.status !== 'closed' && ride?.created_by !== data.user?.id}
			<button
				onclick={() => handleUserJoin(data.my_trip)}
				disabled={ride?.current_passengers === ride?.max_pass}
				class="mr-2 rounded bg-primary-600 px-3 py-2 text-white hover:bg-primary-600 disabled:border-gray-300 disabled:bg-gray-300 disabled:text-white"
			>
				JOIN TRIP
			</button>
		{/if}
	</div>

	<div class="container m-1 mx-auto w-full bg-white p-4 shadow">
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
		</div>

		{#if ride?.status !== 'closed'}
			<!-- List of passengers -->
			<div class="flex flex-col space-y-2">
				<h2 class="text-lg font-bold">Passengers:</h2>
				<ul class="list-none space-y-2">
					<li class="rounded-lg border bg-gray-50 p-4 shadow-md">
						<div class="flex items-center justify-between gap-4">
							<div>
								{#await data.supabase
									.from('profiles')
									.select('*')
									.eq('id', ride?.created_by)
									.single()}
									<p>Loading...</p>
								{:then { data: owner }}
									<a
										class=" break-all font-semibold text-gray-800"
										href="/private/profile/{ride?.created_by}">{owner.name} (Owner)</a
									>
								{/await}
							</div>
							<div>
								{#await data.supabase
									.from('user_reviews')
									.select('*')
									.eq('review_for', ride?.created_by)}
									<p>Loading...</p>
								{:then { data: reviews }}
									{#if reviews.length === 0}
										<p class="text-gray-500">User has no reviews</p>
									{:else}
										<p class="text-gray-500">
											Average rating:
											<strong
												>{(
													reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
												).toFixed(1)}</strong
											>
										</p>
									{/if}
								{/await}
							</div>
						</div>
					</li>
					{#each ride?.trip_passengers as passenger}
						<li class="rounded-lg border bg-gray-50 p-4 shadow-md">
							<div class="flex items-center justify-between">
								<a
									href="/private/profile/{passenger?.user_id}"
									class="break-all font-semibold text-gray-800"
								>
									{passenger?.name}
								</a>
								<div class="flex flex-row items-center gap-4">
									{#if passenger?.user_id !== data.user?.id}
										<button
											class="mr-2 text-nowrap rounded bg-red-500 px-3 py-2 text-xs text-white hover:bg-red-800"
											onclick={() => kickUser(passenger?.user_id)}
										>
											KICK
										</button>
									{/if}
									{#await data.supabase
										.from('user_reviews')
										.select('*')
										.eq('review_for', passenger?.user_id)}
										<p>Loading...</p>
									{:then { data: reviews }}
										{#if reviews.length === 0}
											<p class="text-gray-500">User has no reviews</p>
										{:else}
											<p class="text-gray-500">
												Average rating:
												<strong
													>{(
														reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
													).toFixed(1)}</strong
												>
											</p>
										{/if}
									{/await}
								</div>
							</div>
						</li>
					{/each}
				</ul>
			</div>

			{#if ride?.created_by === data.user?.id}
				<div class="mt-10 flex flex-col items-center gap-3">
					<button
						onclick={MarkTripComplete}
						class="w-full text-nowrap rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
						>Mark Trip Complete</button
					>
					<p class="text-xs text-tertiary-800">
						Warning: This will close the chat and mark the trip as complete
					</p>
				</div>
			{/if}
		{/if}

		{#if ride?.status === 'closed'}
			<div class="mt-5 bg-gray-100 p-4">
				<p class="text-2xl font-bold">Review Users:</p>
			</div>
			<div class=" flex flex-col space-y-2">
				<h2 class="text-lg font-bold">Passengers:</h2>
				<ul class="list-none space-y-6">
					<li class="my-2">
						{#await data.supabase.from('profiles').select('*').eq('id', ride?.created_by).single()}
							Loading...
						{:then { data: owner }}
							<a class="text-lg font-bold" href="/private/profile/{ride?.created_by}"
								>{owner?.name} (Owner)</a
							>
						{/await}

						{#await data.supabase
							.from('user_reviews')
							.select('*')
							.eq('review_for', ride?.created_by)
							.eq('created_by', data.user?.id)
							.eq('trip_id', ride?.id)
							.single()}
							Loading...
						{:then { data: exists }}
							{#if exists}
								<div
									class="m-2 flex flex-col justify-start space-y-2 rounded-lg border border-purple-700 p-2"
								>
									<p class="font-bold">Your review:</p>
									<Ratings value={exists?.rating || 0} max={5} min={1}>
										<svelte:fragment slot="empty"><LucideStar /></svelte:fragment>
										<svelte:fragment slot="half"><LucideStarHalf /></svelte:fragment>
										<svelte:fragment slot="full"><LucideStar fill="yellow" /></svelte:fragment>
									</Ratings>
									<p>{exists.comment}</p>
									<!-- <p class="text-sm text-gray-700">Rating: {exists.rating}</p> -->
								</div>
							{:else if data.user?.id === ride?.created_by}
								<div></div>
								<!-- <div class="m-2 flex flex-col space-y-2 rounded border bg-yellow-100 p-2">
								<p class="font-bold">You can't review yourself</p>
							</div> -->
							{:else}
								<form onsubmit={handleSubmitReview} class="mt-2 flex flex-row justify-start gap-2">
									<div
										class="flex flex-col rounded-xl border border-primary-500 p-3 drop-shadow-xl"
									>
										<span class="text-md mb-2 font-semibold">Create your review:</span>
										<input type="hidden" name="ride_id" value={ride?.id} />
										<input type="hidden" name="user_id" value={ride?.created_by} />
										<label class="mb-2 flex flex-col">
											<input type="hidden" name="rating" bind:value={reviewvalue} />
											<Ratings
												bind:value={reviewvalue}
												max={5}
												min={1}
												interactive
												on:icon={iconClick}
											>
												<svelte:fragment slot="empty"><LucideStar /></svelte:fragment>
												<svelte:fragment slot="half"><LucideStarHalf /></svelte:fragment>
												<svelte:fragment slot="full"><LucideStar fill="yellow" /></svelte:fragment>
											</Ratings>
										</label>
										<label class="mb-2 flex flex-col">
											<textarea
												name="comment"
												class="rounded border p-2"
												placeholder="Type a review"
												rows="4"
											></textarea>
										</label>

										<button
											type="submit"
											class="rounded bg-secondary-500 px-4 py-2 text-white hover:bg-secondary-600"
										>
											Submit
										</button>
									</div>
								</form>
							{/if}
						{/await}
					</li>
					{#each ride?.trip_passengers as passenger, passenger_index}
						<li>
							<a href="/private/profile/{passenger?.user_id}">{passenger?.name}</a>
							{#await data.supabase
								.from('user_reviews')
								.select('*')
								.eq('review_for', passenger?.user_id)
								.eq('created_by', data.user?.id)
								.eq('trip_id', ride?.id)
								.single()}
								Loading...
							{:then { data: exists }}
								{#if exists}
									<div
										class="m-2 flex flex-col justify-start space-y-2 rounded-lg border border-purple-700 p-2"
									>
										<p class="font-bold">Your review:</p>
										<Ratings value={exists?.rating || 0} max={5} min={1}>
											<svelte:fragment slot="empty"><LucideStar /></svelte:fragment>
											<svelte:fragment slot="half"><LucideStarHalf /></svelte:fragment>
											<svelte:fragment slot="full"><LucideStar fill="yellow" /></svelte:fragment>
										</Ratings>
										<p>{exists.comment}</p>
										<!-- <p class="text-sm text-gray-700">Rating: {exists.rating}</p> -->
									</div>
								{:else if data.user?.id === passenger?.user_id}
									<div></div>
									<!-- <div class="m-2 flex flex-col space-y-2 rounded border bg-yellow-100 p-2">
										<p class="font-bold">You can't review yourself</p>
									</div> -->
								{:else}
									<form
										onsubmit={handleSubmitReview}
										class="mt-2 flex flex-row justify-start gap-2"
									>
										<div
											class="flex flex-col rounded-xl border border-primary-500 p-3 drop-shadow-xl"
										>
											<span class="text-md mb-2 font-semibold">Create your review:</span>
											<input type="hidden" name="ride_id" value={ride?.id} />
											<input type="hidden" name="user_id" value={passenger?.user_id} />
											<label class="mb-2 flex flex-col">
												<input type="hidden" name="rating" bind:value={reviewvalue} />
												<Ratings
													bind:value={reviewvalue}
													max={5}
													min={1}
													interactive
													on:icon={iconClick}
												>
													<svelte:fragment slot="empty"><LucideStar /></svelte:fragment>
													<svelte:fragment slot="half"><LucideStarHalf /></svelte:fragment>
													<svelte:fragment slot="full"><LucideStar fill="yellow" /></svelte:fragment
													>
												</Ratings>
											</label>
											<label class="mb-2 flex flex-col">
												<textarea
													name="comment"
													class="rounded border p-2"
													placeholder="Type a review"
													rows="4"
												></textarea>
											</label>

											<button
												type="submit"
												class="rounded bg-secondary-500 px-4 py-2 text-white hover:bg-secondary-600"
											>
												Submit
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
			<div>
				<div class="space-y-4 p-4">
					<h2 class="text-center text-2xl font-semibold text-gray-800">Instant Chat</h2>

					{#if $isLoading}
						<p class="text-center text-gray-500">Loading messages...</p>
					{:else}
						<!-- Message Display Area -->
						<div
							class="flex max-h-96 flex-col-reverse space-y-4 overflow-y-auto rounded-lg bg-gray-50 p-4 shadow-md"
						>
							{#each $messages as { content, created_at, user_id, name }}
								{#if user_id === data.user?.id}
									<!-- User Message -->
									<div class="mb-2 self-end">
										<p class="text-right font-semibold text-red-700">
											<span class="text-xs text-red-300"
												>{new Date(created_at).toLocaleTimeString()}</span
											> You
										</p>
										<p
											class="w-fit break-all rounded-md border border-red-300 bg-red-100 px-3 py-2 text-gray-800 shadow-md"
										>
											{content}
										</p>
									</div>
								{:else}
									<!-- Other User Message -->
									<div class="mb-2">
										<p class="font-semibold capitalize text-purple-700">{name}</p>
										<p
											class="w-fit break-all rounded-md border border-purple-300 bg-purple-100 px-3 py-2 text-gray-800 shadow-md"
										>
											{content}
										</p>
									</div>
								{/if}
							{/each}
							{#if $messages.length === 0}
								<p>Start the conversation here</p>
							{/if}
						</div>
					{/if}

					<!-- Message Input Area -->
					<form onsubmit={sendMessage} class="flex flex-col space-y-2">
						<input
							bind:value={newMessage}
							placeholder="Type your message..."
							class="w-full rounded-lg border-2 border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-secondary-400"
							type="text"
						/>
						<button
							type="submit"
							class="rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-secondary-700 disabled:cursor-not-allowed disabled:bg-gray-300"
						>
							Send
						</button>
					</form>
				</div>
			</div>
		{/if}
	</div>
</div>
