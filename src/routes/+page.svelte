<script>
	import { page } from "$app/stores";

</script>

<div class="bg-gray-100 font-sans h-full">
    <!-- Navbar -->
    <nav class="bg-blue-500 p-4">
        <div class="container mx-auto flex justify-between items-center">
            <a href="{$page.url.href}" class="text-white text-xl font-bold">Carpool</a>
            <div class="space-x-4">
                <a href="{$page.url.href}auth#register" class="text-white">Register</a>
                <a href="{$page.url.href}auth#login" class="text-white">Login</a>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="bg-blue-700 text-white py-20 text-center">
        <h1 class="text-5xl font-bold">Welcome to Carpool</h1>
        <p class="mt-4 text-xl">Connecting commuters for a smarter, greener way to travel</p>
        <div class="mt-8">
            <a href="{$page.url.href}auth#register" class="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg text-lg mr-4">Register</a>
            <a href="{$page.url.href}auth#login" class="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded-lg text-lg">Login</a>
        </div>
    </section>

    <!-- About Section -->
    <section class="py-16 bg-white text-center">
        <div class="container mx-auto">
            <h2 class="text-3xl font-semibold">About Carpool</h2>
            <p class="mt-4 text-lg max-w-2xl mx-auto">
                Carpool is a platform that connects commuters across Singapore, helping you save on transport costs while reducing your carbon footprint. Join the community and start carpooling today!
            </p>
        </div>
    </section>

    <!-- Register Section -->
    <section id="register" class="bg-gray-200 py-16">
        <div class="container mx-auto text-center">
            <h2 class="text-3xl font-semibold">Join Us Today</h2>
            <p class="mt-4 text-lg">Sign up to start carpooling with fellow commuters.</p>
            <a href="{$page.url.href}auth#register" class="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg text-lg mt-8 inline-block">Register Now</a>
        </div>
    </section>

    <!-- Login Section -->
    <section id="login" class="py-16">
        <div class="container mx-auto text-center">
            <h2 class="text-3xl font-semibold">Already a Member?</h2>
            <p class="mt-4 text-lg">Login to access your carpool details.</p>
            <a href="{$page.url.href}auth#login" class="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded-lg text-lg mt-8 inline-block">Login</a>
        </div>
    </section>

    <!-- Footer -->
    <div class="bg-blue-500 text-white py-6 text-center">
      <div class="flex flex-row justify-center gap-3">
        <p>2025 Carpool. All rights reserved. </p>
      </div>
    </div>
</div>
