<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';
	import { writable } from 'svelte/store';
	import { Star, StarHalf, Edit2, Save, X, User, Phone, Mail, MessageSquare, Lock, Eye, EyeOff } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	let newPassword = writable('');
	let confirmPassword = writable('');
	let errorMessage = writable('');

	let showUpdatePassword = $state(false);
	let hideContact = $state(data?.profile?.ispublic);

	async function toggleContact() {
		const { error } = await data.supabase
			.from('profiles')
			.update({ ispublic: hideContact })
			.eq('id', data.user?.id)
			.single();

		if (error) {
			alert(error.message);
		} else {
			invalidateAll();
		}
	}

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
			showUpdatePassword = false;
			$newPassword = '';
			$confirmPassword = '';
			$errorMessage = '';
		}
	}

	let editingName = $state(false);
	let name = $state(data?.profile?.name ?? '');

	let editingPhone = $state(false);
	let phone = $state(data?.profile?.phone ?? '');

	let editingTgUsername = $state(false);
	let tg_username = $state(data?.profile?.tg_username ?? '');

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

<div class="container mx-auto px-4 py-8 max-w-4xl">
	<!-- Profile Information -->
	<div class="bg-white rounded-xl shadow-md overflow-hidden mb-8">
		<div class="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b">
			<h2 class="text-2xl font-medium text-gray-800">Profile Information</h2>
		</div>
		
		<div class="p-6 space-y-6">
			<!-- Name -->
			<div class="flex items-center gap-6">
				<div class="flex-shrink-0">
					<span class="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-600">
						<User size={20} />
					</span>
				</div>
				
				<div class="flex-grow">
					<p class="text-sm font-medium text-gray-500">Name</p>
					{#if editingName}
						<div class="flex mt-1 items-center gap-2">
							<input
								type="text"
								class="w-full rounded-lg border-gray-200 border px-3 py-2 text-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
								bind:value={name}
							/>
							<button
								onclick={saveName}
								class="p-2 rounded-md bg-amber-500 text-white hover:bg-amber-600 transition-colors"
							>
								<Save size={16} />
							</button>
							<button
								onclick={() => (editingName = false)}
								class="p-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
							>
								<X size={16} />
							</button>
						</div>
					{:else}
						<div class="flex items-center justify-between">
							<p class="text-lg font-medium text-gray-800">{name || 'Not set'}</p>
							<button
								onclick={() => (editingName = true)}
								class="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
							>
								<Edit2 size={16} />
							</button>
						</div>
					{/if}
				</div>
			</div>
			
			<!-- Email -->
			<div class="flex items-center gap-6">
				<div class="flex-shrink-0">
					<span class="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-600">
						<Mail size={20} />
					</span>
				</div>
				
				<div class="flex-grow">
					<p class="text-sm font-medium text-gray-500">Email</p>
					<div class="flex items-center justify-between">
						<p class="text-lg font-medium text-gray-800">{data.user?.email}</p>
						<span class="text-xs italic text-gray-500">Cannot be changed</span>
					</div>
				</div>
			</div>
			
			<!-- Phone -->
			<div class="flex items-center gap-6">
				<div class="flex-shrink-0">
					<span class="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-600">
						<Phone size={20} />
					</span>
				</div>
				
				<div class="flex-grow">
					<p class="text-sm font-medium text-gray-500">Phone</p>
					{#if editingPhone}
						<div class="flex mt-1 items-center gap-2">
							<input
								type="tel"
								class="w-full rounded-lg border-gray-200 border px-3 py-2 text-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
								bind:value={phone}
							/>
							<button
								onclick={savePhone}
								class="p-2 rounded-md bg-amber-500 text-white hover:bg-amber-600 transition-colors"
							>
								<Save size={16} />
							</button>
							<button
								onclick={() => (editingPhone = false)}
								class="p-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
							>
								<X size={16} />
							</button>
						</div>
					{:else}
						<div class="flex items-center justify-between">
							<p class="text-lg font-medium text-gray-800">{data?.profile?.phone || 'Not set'}</p>
							<button
								onclick={() => (editingPhone = true)}
								class="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
							>
								<Edit2 size={16} />
							</button>
						</div>
					{/if}
				</div>
			</div>
			
			<!-- Telegram -->
			<div class="flex items-center gap-6">
				<div class="flex-shrink-0">
					<span class="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-600">
						<MessageSquare size={20} />
					</span>
				</div>
				
				<div class="flex-grow">
					<p class="text-sm font-medium text-gray-500">Telegram</p>
					{#if editingTgUsername}
						<div class="flex mt-1 items-center gap-2">
							<input
								type="text"
								class="w-full rounded-lg border-gray-200 border px-3 py-2 text-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
								bind:value={tg_username}
							/>
							<button
								onclick={saveTgUsername}
								class="p-2 rounded-md bg-amber-500 text-white hover:bg-amber-600 transition-colors"
							>
								<Save size={16} />
							</button>
							<button
								onclick={() => (editingTgUsername = false)}
								class="p-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
							>
								<X size={16} />
							</button>
						</div>
					{:else}
						<div class="flex items-center justify-between">
							<p class="text-lg font-medium text-gray-800">{data?.profile?.tg_username || 'Not set'}</p>
							<button
								onclick={() => (editingTgUsername = true)}
								class="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
							>
								<Edit2 size={16} />
							</button>
						</div>
					{/if}
				</div>
			</div>
			
			<!-- Privacy Toggle -->
			<div class="pt-4 border-t">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						{#if hideContact}
							<Eye size={18} class="text-amber-600" />
						{:else}
							<EyeOff size={18} class="text-gray-500" />
						{/if}
						<span class="font-medium text-gray-700">Show contact information on profile</span>
					</div>
					
					<label class="relative inline-flex items-center cursor-pointer">
						<input type="checkbox" bind:checked={hideContact} onchange={toggleContact} class="sr-only peer">
						<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
					</label>
				</div>
			</div>
		</div>
	</div>
	
	<!-- Password Section -->
	<div class="bg-white rounded-xl shadow-md overflow-hidden mb-8">
		<div class="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b">
			<div class="flex items-center justify-between">
				<h2 class="text-2xl font-medium text-gray-800">Password</h2>
				
				<label class="relative inline-flex items-center cursor-pointer">
					<input type="checkbox" bind:checked={showUpdatePassword} class="sr-only peer">
					<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
				</label>
			</div>
		</div>
		
		{#if showUpdatePassword}
			<div class="p-6 space-y-4">
				<div class="flex items-center gap-6">
					<div class="flex-shrink-0">
						<span class="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-600">
							<Lock size={20} />
						</span>
					</div>
					
					<div class="flex-grow">
						<p class="text-sm font-medium text-gray-500">New Password</p>
						<input
							type="password"
							bind:value={$newPassword}
							class="w-full mt-1 rounded-lg border-gray-200 border px-3 py-2 text-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
						/>
					</div>
				</div>
				
				<div class="flex items-center gap-6">
					<div class="flex-shrink-0">
						<span class="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-600">
							<Lock size={20} />
						</span>
					</div>
					
					<div class="flex-grow">
						<p class="text-sm font-medium text-gray-500">Confirm Password</p>
						<input
							type="password"
							bind:value={$confirmPassword}
							class="w-full mt-1 rounded-lg border-gray-200 border px-3 py-2 text-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
						/>
					</div>
				</div>
				
				{#if $errorMessage}
					<div class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
						{$errorMessage}
					</div>
				{/if}
				
				<button
					onclick={updatePassword}
					class="w-full mt-2 py-3 px-4 rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-300"
				>
					Update Password
				</button>
			</div>
		{:else}
			<div class="p-6 text-center text-gray-500">
				Toggle the switch to update your password
			</div>
		{/if}
	</div>
	
	<!-- Reviews Section -->
	<div class="bg-white rounded-xl shadow-md overflow-hidden">
		<div class="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b">
			<h2 class="text-2xl font-medium text-gray-800">Reviews Received</h2>
		</div>
		
		<div class="p-6">
			{#if data.reviews && data.reviews.length > 0}
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					{#each data.reviews as review}
						<div class="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow">
							<div class="flex items-center mb-3">
								{#each Array(5) as _, i}
									{#if i < Math.floor(review.rating)}
										<Star size={18} class="text-amber-400 fill-amber-400" />
									{:else if i < Math.floor(review.rating) + 0.5}
										<StarHalf size={18} class="text-amber-400 fill-amber-400" />
									{:else}
										<Star size={18} class="text-gray-300" />
									{/if}
								{/each}
								<span class="ml-2 text-sm font-medium text-gray-700">{review.rating.toFixed(1)}</span>
							</div>
							
							<p class="font-medium text-gray-800 mb-2">{review.comment}</p>
							
							<div class="flex justify-between items-center text-xs text-gray-500">
								<span>By: {review.profiles?.name || 'Anonymous'}</span>
								<span>{new Date(review.created_at).toLocaleDateString()}</span>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="text-center py-8 text-gray-500">
					No reviews yet
				</div>
			{/if}
		</div>
	</div>
</div>