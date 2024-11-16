<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	let { data }: { data: PageData } = $props();
	let chatroom_id = $page.params.chatroom_id;
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
			.eq('chatroom_id', chatroom_id)
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
				chatroom_id,
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
</script>

<div class="mx-auto max-w-4xl space-y-4 p-4">
	<h2 class="text-center text-2xl font-semibold text-gray-800">
		Chatroom: {data.chatroom_info?.name}
	</h2>

	{#if $isLoading}
		<p class="text-center text-gray-500">Loading messages...</p>
	{:else}
		<!-- Message Display Area -->
		<div class="max-h-96 space-y-4 overflow-y-auto rounded-lg bg-gray-50 p-4 shadow-md">
			{#each $messages as { content, created_at, user_id, id }}
				<div class="rounded-lg  p-3 {user_id === data.user?.id ? 'bg-blue-100' : 'bg-white'} shadow-sm" >
					<div class="mb-2 flex items-center justify-between">
						<span class="text-sm font-semibold   text-gray-700">{user_id}</span>
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
			class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
		>
			Send
		</button>
	</div>
</div>
