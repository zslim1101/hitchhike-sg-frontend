<script>
	import { goto } from '$app/navigation';

	let { children, data } = $props();
	let logout = $derived(async () => {
		const { error } = await data.supabase.auth.signOut();
		if (error) {
			console.error(error);
		}else{
            goto('/')
        }
	});
</script>

<header class="bg-gray-800 p-4 text-white">
	<nav class="flex justify-between items-center">
		<a href="/private/" class="text-xl font-semibold hover:text-gray-300">Dashboard</a>
		<a href="/private/trips" class="text-xl font-semibold hover:text-gray-300">Trips</a>
		<button 
			class="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition" 
			onclick={logout}>
			Logout
		</button>
	</nav>
</header>

<main class="p-4">
	{@render children()}
</main>
