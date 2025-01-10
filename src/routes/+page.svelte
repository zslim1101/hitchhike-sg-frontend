<script>
	import { page } from '$app/stores';
</script>

<div class="h-full bg-gray-100 font-sans">
	<!-- Navbar -->
	<nav class="bg-secondary-500 p-4">
		<div class="container mx-auto flex items-center justify-between">
			<a href={$page.url.href} class="text-xl font-bold text-white">Carpool</a>
			<div class="space-x-4">
				<a href="{$page.url.href}auth#register" class="text-white">Register</a>
				<a href="{$page.url.href}auth#login" class="text-white">Login</a>
			</div>
		</div>
	</nav>

	<!-- Hero Section -->
	<section class="bg-secondary-700 py-20 text-center text-white">
		<h1 class="text-5xl font-bold">Welcome to Carpool</h1>
		<p class="mt-4 text-xl">Connecting commuters for a smarter, greener way to travel</p>
		<div class="mt-8">
			<a
				href="{$page.url.href}auth#register"
				class="mr-4 rounded-lg bg-primary-500 px-6 py-3 text-lg text-white hover:bg-primary-600"
				>Register</a
			>
			<a
				href="{$page.url.href}auth#login"
				class="rounded-lg bg-yellow-500 px-6 py-3 text-lg text-white hover:bg-yellow-600">Login</a
			>
		</div>
	</section>

	<!-- About Section -->
	<section class="bg-white py-16 text-center">
		<div class="container mx-auto">
			<h2 class="text-3xl font-semibold">About Carpool</h2>
			<p class="mx-auto mt-4 max-w-2xl text-lg">
				Carpool is a platform that connects commuters across Singapore, helping you save on
				transport costs while reducing your carbon footprint. Join the community and start
				carpooling today!
			</p>
		</div>
	</section>

	<!-- Register Section -->
	<section id="register" class="bg-gray-200 py-16">
		<div class="container mx-auto text-center">
			<h2 class="text-3xl font-semibold">Join Us Today</h2>
			<p class="mt-4 text-lg">Sign up to start carpooling with fellow commuters.</p>
			<a
				href="{$page.url.href}auth#register"
				class="mt-8 inline-block rounded-lg bg-primary-500 px-6 py-3 text-lg text-white hover:bg-primary-600"
				>Register Now</a
			>
		</div>
	</section>

	<!-- Login Section -->
	<section id="login" class="py-16">
		<div class="container mx-auto text-center">
			<h2 class="text-3xl font-semibold">Already a Member?</h2>
			<p class="mt-4 text-lg">Login to access your carpool details.</p>
			<a
				href="{$page.url.href}auth#login"
				class="mt-8 inline-block rounded-lg bg-yellow-500 px-6 py-3 text-lg text-white hover:bg-yellow-600"
				>Login</a
			>
		</div>
	</section>

	<!-- Footer -->
	<div class="bg-secondary-500 py-6 text-center text-white">
		<div class="flex flex-row justify-center gap-3">
			<p>2025 Carpool. All rights reserved.</p>
		</div>
	</div>
</div>
