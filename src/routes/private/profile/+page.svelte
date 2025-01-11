<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { Ratings } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import { writable } from 'svelte/store';
	import { LucideStar, LucideStarHalf } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	let newPassword = writable('');
	let confirmPassword = writable('');
	let errorMessage = writable('');

	async function updatePassword() {
		if ($newPassword !== $confirmPassword) {
			errorMessage.set('Passwords do not match');
			return;
		}

		const { error } = await data.supabase.auth.updateUser({ password: $newPassword });
		if (error) {
			errorMessage.set(error.message);
		} else {
			alert('Password updated successfully');
		}
	}

	let editingName = $state(false);
	let name = $state(data?.profile?.name ?? '');

	let editingPhone = $state(false);
	let phone = $state(data?.profile?.phone ?? '');

	async function savePhone() {
		const { error } = await data.supabase
			.from('profiles')
			.update({ phone })
			.eq('id', data.user?.id)
			.single();
		if (error) {
			alert(error.message);
		} else {
			invalidateAll();
			editingPhone = false;
		}
	}

	let editingTgUsername = $state(false);
	let tg_username = $state(data?.profile?.tg_username ?? '');

	async function saveTgUsername() {
		const { error } = await data.supabase
			.from('profiles')
			.update({ tg_username })
			.eq('id', data.user?.id)
			.single();
		if (error) {
			alert(error.message);
		} else {
			invalidateAll();
			editingTgUsername = false;
		}
	}

	async function saveName() {
		const { error } = await data.supabase
			.from('profiles')
			.update({ name })
			.eq('id', data.user?.id)
			.single();
		if (error) {
			alert(error.message);
		} else {
			invalidateAll();
			editingName = false;
		}
	}
</script>

<div class="container mx-auto space-y-4">
	<div class="rounded-lg bg-white p-4 shadow-lg">
		<h2 class="text-center text-2xl font-semibold">Profile</h2>
		<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
			<div>
				<p class="block font-bold">Name</p>
				{#if editingName}
					<input
						type="text"
						class="mt-1 w-full rounded-lg border px-4 py-2 text-gray-700 outline-none"
						bind:value={name}
					/>
					<button
						onclick={saveName}
						class="mt-1 rounded bg-secondary-500 px-2 py-1 text-xs text-white hover:bg-secondary-600"
						>Save</button
					>
					<button
						onclick={() => (editingName = false)}
						class="mt-1 rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
						>Cancel</button
					>
				{:else}
					<p class="mt-1">{name}</p>
					<button
						onclick={() => (editingName = true)}
						class="mt-1 rounded bg-gray-500 px-2 py-1 text-xs text-white hover:bg-gray-600"
						>Edit</button
					>
				{/if}
			</div>
			<div>
				<p class="block font-bold">Email</p>
				<p class="mt-1">{data.user?.email}</p>
				<p class="mt-1 italic text-gray-500">You cannot change your email</p>
			</div>
			<div>
				<p class="block font-bold">Phone</p>
				{#if editingPhone}
					<input
						type="tel"
						class="mt-1 w-full rounded-lg border px-4 py-2 text-gray-700 outline-none"
						bind:value={phone}
					/>
					<button
						onclick={savePhone}
						class="mt-1 rounded bg-secondary-500 px-2 py-1 text-xs text-white hover:bg-secondary-600"
						>Save</button
					>
					<button
						onclick={() => (editingPhone = false)}
						class="mt-1 rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
						>Cancel</button
					>
				{:else}
					<p class="mt-1">{data?.profile?.phone ?? 'No phone number'}</p>
					<button
						onclick={() => (editingPhone = true)}
						class="mt-1 rounded bg-gray-500 px-2 py-1 text-xs text-white hover:bg-gray-600"
						>Edit</button
					>
				{/if}
			</div>
			<div>
				<p class="block font-bold">Telegram</p>
				{#if editingTgUsername}
					<input
						type="text"
						class="mt-1 w-full rounded-lg border px-4 py-2 text-gray-700 outline-none"
						bind:value={tg_username}
					/>
					<button
						onclick={saveTgUsername}
						class="mt-1 rounded bg-secondary-500 px-2 py-1 text-xs text-white hover:bg-secondary-600"
						>Save</button
					>
					<button
						onclick={() => (editingTgUsername = false)}
						class="mt-1 rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
						>Cancel</button
					>
				{:else}
					<p class="mt-1">{data?.profile?.tg_username ?? 'No telegram username'}</p>
					<button
						onclick={() => (editingTgUsername = true)}
						class="mt-1 rounded bg-gray-500 px-2 py-1 text-xs text-white hover:bg-gray-600"
						>Edit</button
					>
				{/if}
			</div>
		</div>
	</div>

	<div class="rounded-lg bg-white p-4 shadow-lg">
		<h2 class="text-center text-2xl font-semibold">Update Password</h2>
		<div class="mt-4 space-y-4">
			<div>
				<label for="d" class="block text-sm font-medium text-gray-700">New Password</label>
				<input
					type="password"
					bind:value={$newPassword}
					class="mt-1 w-full rounded-lg border px-4 py-2 text-gray-700 outline-none focus:ring-2 focus:ring-secondary-500"
				/>
			</div>
			<div>
				<label for="d" class="block text-sm font-medium text-gray-700">Confirm Password</label>
				<input
					type="password"
					bind:value={$confirmPassword}
					class="mt-1 w-full rounded-lg border px-4 py-2 text-gray-700 outline-none focus:ring-2 focus:ring-secondary-500"
				/>
			</div>
			<p class="text-red-500">{$errorMessage}</p>
			<button
				onclick={updatePassword}
				class="w-full rounded-lg bg-secondary-600 py-2 font-medium text-white hover:bg-secondary-700"
			>
				Update Password
			</button>
		</div>
	</div>

	<div class="rounded-lg bg-white p-4 shadow-lg">
		<h2 class="text-center text-2xl font-semibold">Reviews Received:</h2>
		<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
			{#each data.reviews as review}
				<div class="w-full rounded-lg bg-white p-4 shadow-md">
					<div>
						<Ratings value={review.rating} max={5} min={1}>
							<svelte:fragment slot="empty"><LucideStar /></svelte:fragment>
							<svelte:fragment slot="half"><LucideStarHalf /></svelte:fragment>
							<svelte:fragment slot="full"><LucideStar fill="yellow" /></svelte:fragment>
						</Ratings>
						<p class="font-bold">{review.comment}</p>
						<p class="text-sm text-gray-500">Given by: {review.profiles?.name}</p>
						<p class="text-right text-sm text-gray-500">
							Review Date: {new Date(review.created_at).toLocaleString()}
						</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
