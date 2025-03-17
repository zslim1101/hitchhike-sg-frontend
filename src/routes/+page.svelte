<script>
	import { page } from '$app/stores';
	import { fly, fade, scale, slide } from 'svelte/transition';
	import {
		Car,
		Users,
		Globe,
		ArrowRight,
		ChevronDown,
		Facebook,
		Twitter,
		Instagram,
		MapPin,
		Star,
		Search,
		Bell,
		Wallet,
		TrendingUp,
		Shield,
		RefreshCw,
		Zap,
		Info,
		Linkedin,
		Heart,
		Check,
		Coffee
	} from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let isVisible = false;
	let activeSection = 'hero';
	let mobileMenuOpen = false;

	onMount(() => {
		isVisible = true;

		// Intersection observer for sections
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						activeSection = entry.target.id;
					}
				});
			},
			{ threshold: 0.5 }
		);

		document.querySelectorAll('section[id]').forEach((section) => {
			observer.observe(section);
		});
	});

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}
</script>

<div class="min-h-screen bg-white font-sans text-gray-800">
	<!-- Sticky Navbar -->
	<nav class="sticky top-0 z-50 bg-white shadow-md">
		<div class="container mx-auto flex items-center justify-between px-4 py-3">
			<div class="flex items-center">
				<a href={$page.url.origin + $page.url.pathname} class="flex items-center">
					<Car size={28} class="text-red-600" />
					<span class="ml-2 text-2xl font-bold"
						>Carpool<span class="text-yellow-500">Asia</span></span
					>
				</a>
			</div>

			<!-- Desktop Nav -->
			<div class="hidden space-x-8 md:flex">
				<a href="#features" class="text-gray-800 transition-colors hover:text-red-600">Features</a>
				<a href="#how-it-works" class="text-gray-800 transition-colors hover:text-red-600"
					>How It Works</a
				>
				<a href="#testimonials" class="text-gray-800 transition-colors hover:text-red-600"
					>Testimonials</a
				>
				<a href="#pricing" class="text-gray-800 transition-colors hover:text-red-600">Pricing</a>
			</div>

			<div class="hidden items-center space-x-4 md:flex">
				<a
					href="{$page.url.origin + $page.url.pathname}auth#login"
					class="rounded-full px-5 py-2 text-red-600 hover:bg-red-50">Login</a
				>
				<a
					href="{$page.url.origin + $page.url.pathname}auth#register"
					class="rounded-full bg-gradient-to-r from-red-600 to-yellow-500 px-5 py-2 font-medium text-white shadow-lg shadow-red-200 transition-all hover:shadow-xl"
					>Sign Up Free</a
				>
			</div>

			<!-- Mobile menu button -->
			<!-- svelte-ignore a11y_consider_explicit_label -->
			<button on:click={toggleMobileMenu} class="rounded-md p-2 text-gray-800 md:hidden">
				<div class="mb-1.5 h-0.5 w-6 bg-gray-800"></div>
				<div class="mb-1.5 h-0.5 w-6 bg-gray-800"></div>
				<div class="h-0.5 w-6 bg-gray-800"></div>
			</button>
		</div>

		<!-- Mobile Nav Menu -->
		{#if mobileMenuOpen}
			<div
				transition:fade={{ duration: 150 }}
				class="absolute left-0 top-full w-full bg-white shadow-lg md:hidden"
			>
				<div class="flex flex-col px-4 py-2">
					<a href="#features" class="border-b border-gray-100 py-3">Features</a>
					<a href="#how-it-works" class="border-b border-gray-100 py-3">How It Works</a>
					<a href="#testimonials" class="border-b border-gray-100 py-3">Testimonials</a>
					<a href="#pricing" class="border-b border-gray-100 py-3">Pricing</a>
					<div class="flex flex-col gap-2 py-4">
						<a
							href="{$page.url.origin + $page.url.pathname}auth#login"
							class="rounded-full border border-red-600 py-2 text-center text-red-600">Login</a
						>
						<a
							href="{$page.url.origin + $page.url.pathname}auth#register"
							class="rounded-full bg-gradient-to-r from-red-600 to-yellow-500 py-2 text-center font-medium text-white"
							>Sign Up Free</a
						>
					</div>
				</div>
			</div>
		{/if}
	</nav>

	<!-- Hero Section -->
	<section
		id="hero"
		class="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-yellow-500 pb-32 pt-16 text-white"
	>
		<!-- Background Elements -->
		<div class="absolute inset-0 opacity-20">
			<div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-yellow-400"></div>
			<div class="absolute left-40 top-40 h-32 w-32 rounded-full bg-red-700"></div>
			<div class="absolute -bottom-10 left-10 h-48 w-48 rounded-full bg-red-700"></div>
			<div class="absolute bottom-20 right-52 h-24 w-24 rounded-full bg-yellow-300"></div>
		</div>

		<div class="container relative mx-auto px-4">
			<div class="grid gap-12 md:grid-cols-2">
				<div class="flex flex-col justify-center">
					{#if isVisible}
						<div in:fly={{ y: 50, duration: 800, delay: 200 }}>
							<span
								class="mb-4 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium backdrop-blur-sm"
								>Reimagining Commutes in Asia</span
							>
							<h1
								class="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl"
							>
								Share Rides, <br />
								<span class="text-yellow-300">Save Money,</span><br />
								Connect Lives
							</h1>
							<p class="mt-6 text-lg text-white/90">
								Join Asia's fastest growing carpooling community. Reduce traffic, save costs, and
								make friendships on your daily commute.
							</p>
							<div class="mt-8 flex flex-wrap gap-4">
								<a
									href="{$page.url.origin + $page.url.pathname}auth#register"
									class="group flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3 font-medium text-red-600 shadow-lg shadow-red-700/30 transition-all hover:bg-yellow-50 hover:shadow-xl"
								>
									Get Started <ArrowRight
										size={18}
										class="transition-transform group-hover:translate-x-1"
									/>
								</a>
								<a
									href="#how-it-works"
									class="flex items-center gap-2 rounded-full border-2 border-white/50 px-6 py-3 font-medium backdrop-blur-sm transition-colors hover:bg-white/20"
								>
									How It Works <ChevronDown size={18} />
								</a>
							</div>
							<div class="mt-8 flex items-center gap-4">
								<div class="flex -space-x-2">
									<div
										class="h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-yellow-200"
									>
										<div class="h-full w-full bg-red-100"></div>
									</div>
									<div
										class="h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-yellow-200"
									>
										<div class="h-full w-full bg-red-200"></div>
									</div>
									<div
										class="h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-yellow-200"
									>
										<div class="h-full w-full bg-red-300"></div>
									</div>
								</div>
								<p class="z-40 text-sm">
									Trusted by <span class="font-bold">10,000+</span> daily commuters
								</p>
							</div>
						</div>
					{/if}
				</div>
				<div class="flex items-center justify-center">
					{#if isVisible}
						<div
							in:scale={{ duration: 800, delay: 400, start: 0.8 }}
							class="relative h-full max-h-96 w-full"
						>
							<div class="absolute inset-0 flex items-center justify-center">
								<div class="h-64 w-64 rounded-full bg-yellow-300/30 backdrop-blur-sm"></div>
							</div>
							<div class="relative mx-auto flex items-center justify-center">
								<img
									src="/app-image.png"
									alt="Carpool Asia App Interface"
									class="rounded-xl shadow-2xl"
								/>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Wave Divider -->
		<div class="absolute bottom-0 left-0 right-0">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" class="fill-white">
				<path
					d="M0,96L60,80C120,64,240,32,360,32C480,32,600,64,720,74.7C840,85,960,75,1080,64C1200,53,1320,43,1380,37.3L1440,32L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
				></path>
			</svg>
		</div>
	</section>

	<!-- Stats Section -->
	<section class="py-16">
		<div class="container mx-auto px-4">
			<div class="grid grid-cols-2 gap-8 md:grid-cols-4">
				{#if isVisible}
					<div in:fade={{ delay: 300, duration: 800 }} class="flex flex-col items-center">
						<Car size={32} class="mb-3 text-red-600" />
						<span class="text-4xl font-bold">1M+</span>
						<span class="text-center text-sm text-gray-600">Rides Shared</span>
					</div>
					<div in:fade={{ delay: 400, duration: 800 }} class="flex flex-col items-center">
						<Users size={32} class="mb-3 text-red-600" />
						<span class="text-4xl font-bold">500K+</span>
						<span class="text-center text-sm text-gray-600">Happy Users</span>
					</div>
					<div in:fade={{ delay: 500, duration: 800 }} class="flex flex-col items-center">
						<Globe size={32} class="mb-3 text-red-600" />
						<span class="text-4xl font-bold">12</span>
						<span class="text-center text-sm text-gray-600">Asian Cities</span>
					</div>
					<div in:fade={{ delay: 600, duration: 800 }} class="flex flex-col items-center">
						<MapPin size={32} class="mb-3 text-red-600" />
						<span class="text-4xl font-bold">45K</span>
						<span class="text-center text-sm text-gray-600">Routes</span>
					</div>
				{/if}
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section id="features" class="bg-red-50 py-24">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<span
					class="mb-2 inline-block rounded-full bg-red-100 px-4 py-1 text-sm font-medium text-red-600"
					>Why Choose CarpoolAsia</span
				>
				<h2 class="text-3xl font-bold md:text-4xl">Smart Carpooling for Asia's Urban Jungles</h2>
				<p class="mx-auto mt-4 max-w-xl text-gray-600">
					Our platform is designed with Asian cities in mind, addressing the unique traffic
					challenges and commuting patterns.
				</p>
			</div>

			<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
				{#if isVisible}
					<div
						in:fade={{ delay: 200, duration: 800 }}
						class="rounded-xl bg-white p-6 shadow-lg transition-transform hover:translate-y-[-5px]"
					>
						<div
							class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-red-600"
						>
							<Car size={24} />
						</div>
						<h3 class="mb-2 text-xl font-semibold">Real-time Matching</h3>
						<p class="text-gray-600">
							Our AI algorithms match you with the most compatible carpoolers, considering route,
							schedule, and preferences.
						</p>
					</div>

					<div
						in:fade={{ delay: 300, duration: 800 }}
						class="rounded-xl bg-white p-6 shadow-lg transition-transform hover:translate-y-[-5px]"
					>
						<div
							class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600"
						>
							<Users size={24} />
						</div>
						<h3 class="mb-2 text-xl font-semibold">Verified Community</h3>
						<p class="text-gray-600">
							All users are verified through strict identity checks, ensuring a safe and reliable
							community of carpoolers.
						</p>
					</div>

					<div
						in:fade={{ delay: 400, duration: 800 }}
						class="rounded-xl bg-white p-6 shadow-lg transition-transform hover:translate-y-[-5px]"
					>
						<div
							class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-red-600"
						>
							<Globe size={24} />
						</div>
						<h3 class="mb-2 text-xl font-semibold">Carbon Footprint Tracker</h3>
						<p class="text-gray-600">
							Track how much CO2 emissions you've saved by carpooling and contribute to a greener
							planet.
						</p>
					</div>

					<div
						in:fade={{ delay: 500, duration: 800 }}
						class="rounded-xl bg-white p-6 shadow-lg transition-transform hover:translate-y-[-5px]"
					>
						<div
							class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600"
						>
							<Wallet size={24} />
						</div>
						<h3 class="mb-2 text-xl font-semibold">Cost Sharing</h3>
						<p class="text-gray-600">
							Our transparent cost-sharing system helps you save money while ensuring drivers get
							fair compensation for their rides.
						</p>
					</div>

					<div
						in:fade={{ delay: 600, duration: 800 }}
						class="rounded-xl bg-white p-6 shadow-lg transition-transform hover:translate-y-[-5px]"
					>
						<div
							class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-red-600"
						>
							<MapPin size={24} />
						</div>
						<h3 class="mb-2 text-xl font-semibold">Local Knowledge</h3>
						<p class="text-gray-600">
							Navigate through local shortcuts, avoid traffic hotspots, and discover the most
							efficient routes with our Asia-focused mapping.
						</p>
					</div>

					<div
						in:fade={{ delay: 700, duration: 800 }}
						class="rounded-xl bg-white p-6 shadow-lg transition-transform hover:translate-y-[-5px]"
					>
						<div
							class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600"
						>
							<Bell size={24} />
						</div>
						<h3 class="mb-2 text-xl font-semibold">Real-time Notifications</h3>
						<p class="text-gray-600">
							Stay updated with instant alerts about your carpool status, traffic updates, and
							schedule changes.
						</p>
					</div>
				{/if}
			</div>
		</div>
	</section>

	<!-- How It Works Section -->
	<section id="how-it-works" class="py-24">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<span
					class="mb-2 inline-block rounded-full bg-yellow-100 px-4 py-1 text-sm font-medium text-yellow-600"
					>Simple Process</span
				>
				<h2 class="text-3xl font-bold md:text-4xl">How CarpoolAsia Works</h2>
				<p class="mx-auto mt-4 max-w-xl text-gray-600">
					Start sharing rides in just a few easy steps and join thousands of Asian commuters saving
					time and money.
				</p>
			</div>

			<div class="grid gap-10 md:grid-cols-3">
				{#if isVisible}
					<div
						in:fly={{ y: 50, delay: 200, duration: 800 }}
						class="relative flex flex-col items-center text-center"
					>
						<div
							class="absolute left-1/2 top-1/2 hidden h-px w-full -translate-y-1/2 bg-red-200 md:block"
						></div>
						<div
							class="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-yellow-500 text-white"
						>
							<MapPin size={24} />
							<span
								class="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-bold text-red-600 ring-4 ring-red-50"
								>1</span
							>
						</div>
						<h3 class="mb-3 text-xl font-semibold">Set Your Route</h3>
						<p class="text-gray-600">
							Enter your starting point, destination, and preferred schedule to find potential
							carpool matches.
						</p>
					</div>

					<div
						in:fly={{ y: 50, delay: 400, duration: 800 }}
						class="relative flex flex-col items-center text-center"
					>
						<div
							class="absolute left-1/2 top-1/2 hidden h-px w-full -translate-y-1/2 bg-red-200 md:block"
						></div>
						<div
							class="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-yellow-500 text-white"
						>
							<Search size={24} />
							<span
								class="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-bold text-red-600 ring-4 ring-red-50"
								>2</span
							>
						</div>
						<h3 class="mb-3 text-xl font-semibold">Match & Connect</h3>
						<p class="text-gray-600">
							Browse through potential matches, check profiles and ratings, then connect with your
							carpool buddy.
						</p>
					</div>

					<div
						in:fly={{ y: 50, delay: 600, duration: 800 }}
						class="relative flex flex-col items-center text-center"
					>
						<div
							class="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-yellow-500 text-white"
						>
							<Car size={24} />
							<span
								class="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-bold text-red-600 ring-4 ring-red-50"
								>3</span
							>
						</div>
						<h3 class="mb-3 text-xl font-semibold">Share the Ride</h3>
						<p class="text-gray-600">
							Enjoy your journey together, split costs automatically, and earn points for
							sustainable commuting.
						</p>
					</div>
				{/if}
			</div>
		</div>
	</section>

	<!-- Pricing Section -->
	<section
		id="pricing"
		class="relative overflow-hidden bg-gradient-to-br from-red-50 to-yellow-50 py-24"
	>
		<!-- Animated background elements -->
		<div
			class="absolute -right-20 -top-20 h-64 w-64 animate-pulse rounded-full bg-red-500/10"
		></div>
		<div
			class="absolute -left-20 top-40 h-80 w-80 animate-pulse rounded-full bg-yellow-500/10"
		></div>

		<div class="container mx-auto px-4">
			<!-- Section header -->
			<div class="mx-auto mb-16 max-w-3xl text-center" in:fly={{ y: 50, duration: 800 }}>
				<h2
					class="mb-4 bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text pb-2 text-4xl font-bold text-transparent md:text-5xl"
				>
					Community-Powered Pricing
				</h2>
				<p class="mb-6 text-lg text-gray-700">
					Join the movement to make transportation accessible for everyone across Asia
				</p>
				<div class="flex items-center justify-center gap-2">
					<Heart class="text-red-500" size={24} />
					<span class="font-medium text-gray-700">Supported by people like you</span>
				</div>
			</div>

			<!-- Pricing card -->
			<div class="mx-auto max-w-lg" in:scale={{ duration: 700, delay: 300, start: 0.8 }}>
				<div
					class="transform overflow-hidden rounded-2xl border-2 border-yellow-400 bg-white shadow-xl transition-transform duration-300 hover:scale-105"
				>
					<!-- Card header -->
					<div class="bg-gradient-to-r from-red-600 to-yellow-500 px-8 py-6 text-white">
						<div class="flex items-center justify-between">
							<h3 class="text-2xl font-bold">Community Edition</h3>
							<span class="text-3xl font-bold">Free</span>
						</div>
						<p class="mt-2 text-white/90">Forever open source and community-supported</p>
					</div>

					<!-- Card body -->
					<div class="p-8">
						<!-- Feature list -->
						<ul class="mb-8 space-y-4">
							<li class="flex items-start">
								<div class="mr-3 mt-1 rounded bg-yellow-100 p-1">
									<Check class="text-yellow-600" size={16} />
								</div>
								<div>
									<p class="font-medium">Unlimited ride sharing</p>
									<p class="text-sm text-gray-600">
										Connect with drivers and passengers across Asia
									</p>
								</div>
							</li>
							<li class="flex items-start">
								<div class="mr-3 mt-1 rounded bg-yellow-100 p-1">
									<Check class="text-yellow-600" size={16} />
								</div>
								<div>
									<p class="font-medium">Real-time matching algorithm</p>
									<p class="text-sm text-gray-600">
										Smart technology pairs you with the most efficient routes
									</p>
								</div>
							</li>
							<li class="flex items-start">
								<div class="mr-3 mt-1 rounded bg-yellow-100 p-1">
									<Check class="text-yellow-600" size={16} />
								</div>
								<div>
									<p class="font-medium">Community safety features</p>
									<p class="text-sm text-gray-600">Verified profiles and community ratings</p>
								</div>
							</li>
							<li class="flex items-start">
								<div class="mr-3 mt-1 rounded bg-yellow-100 p-1">
									<Check class="text-yellow-600" size={16} />
								</div>
								<div>
									<p class="font-medium">Eco impact tracker</p>
									<p class="text-sm text-gray-600">
										See how your carpooling reduces carbon emissions
									</p>
								</div>
							</li>
						</ul>

						<!-- CTA button -->
						<button
							class="w-full rounded-lg bg-gradient-to-r from-red-500 to-yellow-500 px-6 py-3 text-lg font-medium text-white shadow-md transition-all hover:from-red-600 hover:to-yellow-600 hover:shadow-lg"
						>
							Join Carpool Asia
						</button>
					</div>

					<!-- Support banner -->
					<div class="border-t border-gray-100 bg-gray-50 p-5">
						<div class="flex items-center justify-center gap-x-4">
							<div class="flex items-center">
								<Coffee class="mr-2 text-red-500" size={20} />
								<span class="text-sm text-gray-700">Donations welcome</span>
							</div>
							<div class="flex items-center">
								<Globe class="mr-2 text-yellow-500" size={20} />
								<span class="text-sm text-gray-700">Open-source</span>
							</div>
							<div class="flex items-center">
								<Users class="mr-2 text-red-500" size={20} />
								<span class="text-sm text-gray-700">Community-driven</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Community stats banner -->
				<div
					class="mt-8 rounded-xl bg-white/70 p-4 shadow-md backdrop-blur-sm"
					in:fly={{ y: 20, duration: 500, delay: 600 }}
				>
					<div class="flex items-center justify-center space-x-8">
						<div class="text-center">
							<p class="text-2xl font-bold text-red-600">12k+</p>
							<p class="text-sm text-gray-600">Active users</p>
						</div>
						<div class="text-center">
							<p class="text-2xl font-bold text-yellow-500">8</p>
							<p class="text-sm text-gray-600">Asian countries</p>
						</div>
						<div class="text-center">
							<p class="text-2xl font-bold text-red-600">5k+</p>
							<p class="text-sm text-gray-600">Daily rides</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Testimonials Section -->
	<section id="testimonials" class="bg-gradient-to-b from-white to-red-50 py-24">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<span
					class="mb-2 inline-block rounded-full bg-red-100 px-4 py-1 text-sm font-medium text-red-600"
					>Success Stories</span
				>
				<h2 class="text-3xl font-bold md:text-4xl">Loved Across Asia</h2>
				<p class="mx-auto mt-4 max-w-xl text-gray-600">
					Join thousands of satisfied carpoolers who are transforming their daily commute.
				</p>
			</div>

			<div class="testimonial-slider">
				{#if isVisible}
					<div
						in:slide={{ delay: 300, duration: 800, axis: 'x' }}
						class="grid gap-8 md:grid-cols-3"
					>
						<div class="rounded-xl bg-white p-6 shadow-lg">
							<div class="mb-4 flex text-yellow-400">
								<Star size={20} fill="currentColor" />
								<Star size={20} fill="currentColor" />
								<Star size={20} fill="currentColor" />
								<Star size={20} fill="currentColor" />
								<Star size={20} fill="currentColor" />
							</div>
							<p class="mb-4 italic text-gray-600">
								"CarpoolAsia completely transformed my daily commute in Manila. I save about 2 hours
								each day avoiding traffic, and made some great friends along the way!"
							</p>
							<div class="flex items-center">
								<div class="mr-4 h-12 w-12 overflow-hidden rounded-full bg-red-100">
									<img
										src="/profile-pic-1.png"
										alt="Profile placeholder"
										class="h-full w-full object-cover"
									/>
								</div>
								<div>
									<h4 class="font-semibold">Maria Garcia</h4>
									<p class="text-sm text-gray-500">Manila, Philippines</p>
								</div>
							</div>
						</div>

						<div class="rounded-xl bg-white p-6 shadow-lg">
							<div class="mb-4 flex text-yellow-400">
								<Star size={20} fill="currentColor" />
								<Star size={20} fill="currentColor" />
								<Star size={20} fill="currentColor" />
								<Star size={20} fill="currentColor" />
								<Star size={20} fill="currentColor" />
							</div>
							<p class="mb-4 italic text-gray-600">
								"As a car owner in Singapore, carpooling helps me offset the high cost of owning a
								vehicle here. The app makes it super easy to find reliable passengers!"
							</p>
							<div class="flex items-center">
								<div class="mr-4 h-12 w-12 overflow-hidden rounded-full bg-yellow-100">
									<img
										src="/profile-pic-2.png"
										alt="Profile placeholder"
										class="h-full w-full object-cover"
									/>
								</div>
								<div>
									<h4 class="font-semibold">David Tan</h4>
									<p class="text-sm text-gray-500">Singapore</p>
								</div>
							</div>
						</div>

						<div class="rounded-xl bg-white p-6 shadow-lg">
							<div class="mb-4 flex text-yellow-400">
								<Star size={20} fill="currentColor" />
								<Star size={20} fill="currentColor" />
								<Star size={20} fill="currentColor" />
								<Star size={20} fill="currentColor" />
								<Star size={20} fill="currentColor" />
							</div>
							<p class="mb-4 italic text-gray-600">
								"Bangkok traffic is legendary, but sharing rides with CarpoolAsia makes it bearable.
								I love the carbon tracker feature that shows my environmental impact!"
							</p>
							<div class="flex items-center">
								<div class="mr-4 h-12 w-12 overflow-hidden rounded-full bg-red-100">
									<img
										src="/profile-pic-3.png"
										alt="Profile placeholder"
										class="h-full w-full object-cover"
									/>
								</div>
								<div>
									<h4 class="font-semibold">Priya Suwannatat</h4>
									<p class="text-sm text-gray-500">Bangkok, Thailand</p>
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</section>
	<!-- Web App Access Section (Replaces Download Section) -->
	<section id="webapp" class="py-24">
		<div class="container mx-auto px-4">
			<div
				class="overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 to-yellow-500 shadow-xl"
			>
				<div class="grid items-center md:grid-cols-2">
					<div class="p-8 md:p-12 lg:p-16">
						<span
							class="mb-2 inline-block rounded-full bg-white bg-opacity-20 px-4 py-1 text-sm font-medium text-white"
							>Get Started Today</span
						>
						<h2 class="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
							Ready to Transform Your Commute?
						</h2>
						<p class="mb-8 max-w-md text-lg text-white text-opacity-90">
							Access CarpoolAsia instantly through our web app. No downloads needed - just sign up
							and start carpooling across Asia!
						</p>
						<div class="flex flex-wrap gap-4">
							<button
								on:click={() => {
									goto('/auth#login');
								}}
								class="group flex items-center rounded-lg bg-black px-6 py-3 text-white transition-all duration-300 hover:scale-105 hover:bg-opacity-80 hover:shadow-lg"
								in:slide={{ delay: 300, duration: 800 }}
							>
								<Globe
									size={24}
									class="mr-2 transition-transform duration-300 group-hover:rotate-12"
								/>
								<span>Access Web App</span>
							</button>
							<button
								on:click={() => {
									goto('/auth#login');
								}}
								class="group flex items-center rounded-lg bg-white px-6 py-3 text-red-600 transition-all duration-300 hover:scale-105 hover:bg-opacity-90 hover:shadow-lg"
								in:slide={{ delay: 300, duration: 800 }}
							>
								<Info
									size={24}
									class="mr-2 transition-transform duration-300 group-hover:rotate-12"
								/>
								<span>Learn More</span>
							</button>
						</div>
					</div>
					<div class="hidden p-8 md:block">
						<div class="relative" in:slide={{ delay: 300, duration: 800 }}>
							<div
								class="absolute -left-4 -top-4 h-64 w-64 rounded-full bg-yellow-300 bg-opacity-30 blur-3xl"
							></div>
							<div
								class="absolute -bottom-8 -right-8 h-64 w-64 rounded-full bg-red-500 bg-opacity-30 blur-3xl"
							></div>
							<img
								src="/app-image.png"
								alt="CarpoolAsia Web App Screenshot"
								class="relative z-10 transform rounded-xl shadow-2xl transition-transform duration-500 hover:rotate-1 hover:scale-105"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Benefits Section -->
	<section id="benefits" class="bg-gray-50 py-24">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<span
					class="mb-4 inline-block rounded-full bg-red-100 px-4 py-1 text-sm font-medium text-red-600"
					>Benefits</span
				>
				<h2 class="mb-4 text-4xl font-bold text-gray-900">Why Choose CarpoolAsia Web App?</h2>
				<p class="mx-auto max-w-2xl text-lg text-gray-600">
					Simplify your commute with our hassle-free web platform designed specifically for Asian
					cities.
				</p>
			</div>

			<div
				class="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
				in:slide={{ delay: 300, duration: 800 }}
			>
				<div
					class="rounded-xl bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
				>
					<div class="mb-4 inline-block rounded-full bg-red-100 p-3">
						<Globe size={28} class="text-red-600" />
					</div>
					<h3 class="mb-3 text-xl font-bold text-gray-900">No App Downloads</h3>
					<p class="text-gray-600">
						Access instantly from any device with a browser. No app store visits or storage
						concerns.
					</p>
				</div>

				<div
					class="rounded-xl bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
				>
					<div class="mb-4 inline-block rounded-full bg-yellow-100 p-3">
						<Zap size={28} class="text-yellow-600" />
					</div>
					<h3 class="mb-3 text-xl font-bold text-gray-900">Lightning Fast</h3>
					<p class="text-gray-600">
						Our optimized web app loads quickly even on slower connections, perfect for urban areas.
					</p>
				</div>

				<div
					class="rounded-xl bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
				>
					<div class="mb-4 inline-block rounded-full bg-red-100 p-3">
						<RefreshCw size={28} class="text-red-600" />
					</div>
					<h3 class="mb-3 text-xl font-bold text-gray-900">Always Updated</h3>
					<p class="text-gray-600">
						Get the latest features instantly without waiting for app updates or approvals.
					</p>
				</div>

				<div
					class="rounded-xl bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
				>
					<div class="mb-4 inline-block rounded-full bg-yellow-100 p-3">
						<Users size={28} class="text-yellow-600" />
					</div>
					<h3 class="mb-3 text-xl font-bold text-gray-900">Cross-Platform</h3>
					<p class="text-gray-600">
						Works seamlessly across phones, tablets, and desktops with a consistent experience.
					</p>
				</div>

				<div
					class="rounded-xl bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
				>
					<div class="mb-4 inline-block rounded-full bg-red-100 p-3">
						<Shield size={28} class="text-red-600" />
					</div>
					<h3 class="mb-3 text-xl font-bold text-gray-900">Enhanced Security</h3>
					<p class="text-gray-600">
						Our web platform offers advanced security features to keep your information safe.
					</p>
				</div>

				<div
					class="rounded-xl bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
				>
					<div class="mb-4 inline-block rounded-full bg-yellow-100 p-3">
						<TrendingUp size={28} class="text-yellow-600" />
					</div>
					<h3 class="mb-3 text-xl font-bold text-gray-900">Smart Matching</h3>
					<p class="text-gray-600">
						Our algorithm finds the perfect carpool matches based on your schedule and location.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="py-24">
		<div class="container mx-auto px-4">
			<div
				class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-500 via-red-500 to-red-600 p-8 text-center md:p-16"
			>
				<div class="absolute left-0 top-0 h-full w-full">
					<div class="absolute left-10 top-10 h-32 w-32 rounded-full bg-white opacity-10"></div>
					<div class="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-white opacity-10"></div>
				</div>

				<div class="relative z-10" in:fly={{ y: 50, delay: 200, duration: 800 }}>
					<h2 class="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
						Join the Transportation Revolution
					</h2>
					<p class="mx-auto mb-8 max-w-2xl text-lg text-white text-opacity-90">
						CarpoolAsia is transforming how people travel across Asia's busiest cities. Be part of
						the solution to reduce traffic, emissions, and commuting costs.
					</p>
					<button
						class="group transform rounded-lg bg-white px-8 py-4 text-lg font-bold text-red-600 transition-all duration-300 hover:scale-105 hover:bg-black hover:text-white"
					>
						<span class="flex items-center">
							<ArrowRight
								size={20}
								class="mr-2 transform transition-transform duration-300 group-hover:translate-x-1"
							/>
							Start Carpooling Now
						</span>
					</button>
				</div>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="bg-gray-900 py-16 text-white">
		<div class="container mx-auto px-4">
			<div class="grid gap-8 md:grid-cols-4">
				<div>
					<h3 class="mb-4 flex items-center text-xl font-bold">
						<Car size={24} class="mr-2 text-yellow-500" />
						<span
							class="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-2xl text-transparent"
							>CarpoolAsia</span
						>
					</h3>
					<p class="mb-4 text-gray-400">
						Transforming transportation across Asia with smart carpooling solutions.
					</p>
					<div class="flex space-x-4">
						<a href="#" class="transition-colors hover:text-yellow-500"><Facebook size={20} /></a>
						<a href="#" class="transition-colors hover:text-yellow-500"><Twitter size={20} /></a>
						<a href="#" class="transition-colors hover:text-yellow-500"><Instagram size={20} /></a>
						<a href="#" class="transition-colors hover:text-yellow-500"><Linkedin size={20} /></a>
					</div>
				</div>

				<div>
					<h4 class="mb-4 font-bold">Company</h4>
					<ul class="space-y-2">
						<li>
							<a href="#" class="text-gray-400 transition-colors hover:text-white">About Us</a>
						</li>
						<li>
							<a href="#" class="text-gray-400 transition-colors hover:text-white">Careers</a>
						</li>
						<li><a href="#" class="text-gray-400 transition-colors hover:text-white">Press</a></li>
						<li><a href="#" class="text-gray-400 transition-colors hover:text-white">Blog</a></li>
						<li>
							<a href="#" class="text-gray-400 transition-colors hover:text-white">Contact</a>
						</li>
					</ul>
				</div>

				<div>
					<h4 class="mb-4 font-bold">Resources</h4>
					<ul class="space-y-2">
						<li>
							<a href="#" class="text-gray-400 transition-colors hover:text-white">Help Center</a>
						</li>
						<li>
							<a href="#" class="text-gray-400 transition-colors hover:text-white">Safety Guide</a>
						</li>
						<li>
							<a href="#" class="text-gray-400 transition-colors hover:text-white">Driver Guide</a>
						</li>
						<li>
							<a href="#" class="text-gray-400 transition-colors hover:text-white"
								>Partner Program</a
							>
						</li>
						<li>
							<a href="#" class="text-gray-400 transition-colors hover:text-white"
								>API Documentation</a
							>
						</li>
					</ul>
				</div>

				<div>
					<h4 class="mb-4 font-bold">Legal</h4>
					<ul class="space-y-2">
						<li>
							<a href="#" class="text-gray-400 transition-colors hover:text-white"
								>Terms of Service</a
							>
						</li>
						<li>
							<a href="#" class="text-gray-400 transition-colors hover:text-white">Privacy Policy</a
							>
						</li>
						<li>
							<a href="#" class="text-gray-400 transition-colors hover:text-white">Cookie Policy</a>
						</li>
						<li>
							<a href="#" class="text-gray-400 transition-colors hover:text-white"
								>GDPR Compliance</a
							>
						</li>
						<li>
							<a href="#" class="text-gray-400 transition-colors hover:text-white">Accessibility</a>
						</li>
					</ul>
				</div>
			</div>

			<div class="mt-12 border-t border-gray-800 pt-8 text-center text-gray-500">
				<p>&copy; {new Date().getFullYear()} CarpoolAsia. All rights reserved.</p>
			</div>
		</div>
	</footer>
</div>
