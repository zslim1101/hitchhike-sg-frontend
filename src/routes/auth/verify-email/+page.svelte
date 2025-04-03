<script lang="ts">
	import type { PageData } from './$types';
	import { Mail, Clock, Check, ArrowLeft, Users } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();
</script>

<div class="min-h-svh bg-gradient-to-b from-white to-orange-50">
	<div class="container mx-auto flex h-svh flex-col items-center justify-center p-4">
		<div class="w-full max-w-md rounded-xl border border-orange-100 bg-white p-6 shadow-sm">
			<div class="mb-6 flex justify-center">
				<div class="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
					<Mail class="h-8 w-8 text-orange-500" />
				</div>
			</div>
			
			<h2 class="text-center text-2xl font-bold text-gray-800">One more step!</h2>
			<p class="mt-2 text-center text-gray-600">
				Please verify your email to join the Carpool Asia community
			</p>
			
			<div class="mt-6 space-y-4">
				<div class="rounded-lg bg-orange-50 p-4">
					<div class="flex items-start">
						<Check class="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-orange-500" />
						<p class="text-sm text-gray-700">
							We've sent a verification link to your email inbox
						</p>
					</div>
				</div>
				
				<div class="rounded-lg bg-orange-50 p-4">
					<div class="flex items-start">
						<Clock class="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-orange-500" />
						<p class="text-sm text-gray-700">
							The verification link expires in 24 hours. If you miss it, you'll need to register again.
						</p>
					</div>
				</div>
				
				<div class="rounded-lg bg-orange-50 p-4">
					<div class="flex items-start">
						<Users class="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-orange-500" />
						<p class="text-sm text-gray-700">
							Once verified, you'll get full access to connect with other carpoolers in your area.
						</p>
					</div>
				</div>
			</div>
			
			<div class="mt-8 flex justify-center">
				<a 
					href="/auth" 
					class="flex items-center justify-center rounded-lg bg-orange-500 px-6 py-3 text-white transition hover:bg-orange-600"
				>
					<ArrowLeft class="mr-2 h-4 w-4" />
					Back to Login
				</a>
			</div>
		</div>
		
		<p class="mt-4 text-center text-sm text-gray-500">
			Need help? Contact <span class="text-orange-500">support@carpoolasia.com</span>
		</p>
	</div>
</div>