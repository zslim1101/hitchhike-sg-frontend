<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class=" bg-white">
	<div class="container mx-auto flex h-svh flex-col items-center justify-center">
		<div class="mx-2 mt-4 rounded-md border border-gray-300 bg-slate-100 p-3 text-center">
			<h2 class="text-lg font-bold text-red-600">Thank you for registering</h2>
			<p class="text-md mt-2 text-black">
				Please verify your email by checking in your email inbox for a link.
			</p>
			<p class="mt-2 text-xs italic text-gray-600">
				Take note that the link only lasts for 24 hours and if you have failed to verify by then,
				please register again to receive a new verification link.
			</p>
		</div>
		<div class="mt-4 flex justify-center">
			<a href="/auth" class="rounded bg-primary-500 px-4 py-2 text-white"> Go back to Login </a>
		</div>
	</div>
</div>
