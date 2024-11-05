<script>
	let { children, data } = $props();
	let logout = $derived(async () => {
		const { error } = await data.supabase.auth.signOut();
		if (error) {
			console.error(error);
		}
	});
</script>

<header>
	<nav>
		<a href="/">Home</a>
	</nav>
	<button onclick={logout}>Logout</button>
</header>
<main>
	{@render children()}
</main>
