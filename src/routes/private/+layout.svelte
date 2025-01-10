<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { popup } from '@skeletonlabs/skeleton';
	import { AppBar, Avatar } from '@skeletonlabs/skeleton';
	import { LucideLogOut, LucideUser } from 'lucide-svelte';
	let { children, data } = $props();
	let logout = $derived(async () => {
		const { error } = await data.supabase.auth.signOut();
		if (error) {
			console.error(error);
		} else {
			goto('/');
		}
	});

	const popupFeatured: PopupSettings = {
		// Represents the type of event that opens/closed the popup
		event: 'click',
		// Matches the data-popup value on your popup element
		target: 'popupFeatured',
		// Defines which side of your trigger the popup will appear
		placement: 'bottom-end',
		middleware: {
			// https://floating-ui.com/docs/offset
			offset: { mainAxis: 10, crossAxis: -10 } // or { ... }
		}
	};
</script>

<!-- <nav class="flex justify-between items-center">
		<a href="/private/trips" class="text-xl font-semibold hover:text-gray-300">Trips</a>
		<button 
			class="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition" 
			onclick={logout}>
			Logout
		</button>
	</nav> -->
<AppBar
	background="bg-primary-100 border-b border-fuchsia-300"
	gridColumns="grid-cols-3"
	slotDefault="place-self-center"
	slotTrail="place-content-end"
>
	<svelte:fragment slot="lead"
		><a class="text-xl font-semibold hover:text-primary-500" href="/private/trips">Trips</a
		></svelte:fragment
	>

	<svelte:fragment slot="trail">
		<button use:popup={popupFeatured}
			><Avatar
				width="w-10"
				initials={data.user?.user_metadata.name}
				background="bg-primary-300"
			/></button
		>
		<div class="card w-36 space-x-1 space-y-3 p-4 shadow-xl" data-popup="popupFeatured">
			<a href="/private/profile" class="flex items-center space-x-2 hover:text-primary-500">
				<LucideUser size="16" />
				<span>View Profile</span>
			</a>
			<button onclick={logout} class="flex items-center space-x-2 hover:text-primary-500">
				<LucideLogOut size="16" />
				<span>Logout</span>
			</button>
		</div>
	</svelte:fragment>
</AppBar>

<div class="container mx-auto mt-3">
	{@render children()}
</div>
