<script lang="ts">
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
	import { initializeStores, Modal } from '@skeletonlabs/skeleton';

	initializeStores();
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	let { children, data } = $props();

	onMount(() => {
		const { data: supa_auth } = data.supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== data.session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => supa_auth.subscription.unsubscribe();
	});
</script>

<Modal />

<svelte:head>
	<title>Carpool Asia</title>
	<meta property="og:site_name" content="Carpool Asia" />
	<meta
		name="description"
		content="Find carpool partners, save money on daily commutes, and enjoy a sustainable travel. Carpool Asia connects you with commuters near you. Register and start carpooling now!"
	/>
	<meta
		name="keywords"
		content="carpool, carpooling, carshare, car sharing, singapore, carpool asia, carpooling sg, car sharing sg"
	/>
	<meta name="author" content="Carpool Asia" />
	<!-- Google tag (gtag.js) -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-TP9LK57JX0"></script>
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			dataLayer.push(arguments);
		}
		gtag('js', new Date());

		gtag('config', 'G-TP9LK57JX0');
	</script>
</svelte:head>

{@render children()}
