<script>
	import { Check, MapPin, CarFront } from 'lucide-svelte';
  </script>
  
  <div class="flex min-h-[300px] flex-col items-center justify-center rounded-lg bg-gradient-to-br from-white to-orange-50 p-8 shadow-md">
	<div class="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
	  <Check class="h-8 w-8 text-orange-500" />
	</div>
	
	<h1 class="mb-3 text-3xl font-bold text-gray-800">Welcome to Carpool Asia!</h1>
	
	<p class="mb-6 max-w-md text-center text-gray-600">
	  Your email has been verified successfully. You're now ready to start sharing rides and connecting with the community.
	</p>
	
	<div class="mb-8 flex w-full max-w-md justify-center space-x-4 rounded-lg bg-white p-4 shadow-sm">
	  <div class="flex flex-col items-center justify-center space-y-1 text-center">
		<CarFront class="h-6 w-6 text-orange-400" />
		<span class="text-sm text-gray-600">Share Rides</span>
	  </div>
	  <div class="flex flex-col items-center justify-center space-y-1 text-center">
		<MapPin class="h-6 w-6 text-orange-400" />
		<span class="text-sm text-gray-600">Find Routes</span>
	  </div>
	</div>
	
	<a
	  href="/private/trips"
	  class="group relative inline-flex items-center justify-center overflow-hidden rounded-md bg-orange-500 px-8 py-3 font-medium text-white transition duration-300 hover:bg-orange-600"
	>
	  <span class="relative">Create Your First Trip</span>
	</a>
  </div>