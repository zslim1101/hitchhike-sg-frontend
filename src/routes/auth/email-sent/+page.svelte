<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="mt-8 text-center">
	<h2 class="text-2xl font-semibold text-gray-800">Email Sent</h2>
	<p class="mt-4 text-gray-600">
		We have sent a reset password link to your email. Please proceed to your email to continue.
	</p>
	<a
		href="/auth"
		class="mt-8 inline-block rounded bg-secondary-500 px-6 py-3 text-white transition hover:bg-secondary-600"
	>
		Go back to Login
	</a>
</div>
