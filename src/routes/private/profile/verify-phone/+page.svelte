<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let phone_number = $state(data?.profile?.phone ?? '');

	let verifySent = $state(false);

	let verify_code = $state('');

	const sendVerificationCode = async () => {
		verifySent = true;
		setTimeout(() => {
			verifySent = false;
		}, 300000); // 5 minutes in milliseconds
		const response = await fetch('/send-verify', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				phone_number
			})
		});

		const response_data = await response.json();
		console.log(response_data);
	};

	const verifyVerificationCode = async () => {
		const response = await fetch('/verify-code', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				phone_number,
				code
			})
		});

		const response_data = await response.json();
		console.log(response_data);
	};
</script>

<div class="container mx-auto space-y-4">
	<div class="rounded-lg bg-white p-4 shadow-lg">
		<h2 class="text-center text-2xl font-semibold">Verify Phone</h2>
		<p class="mt-4 text-gray-600">
			Please provide your phone number so we can send you a verification code
		</p>
		<div class="mt-4 space-y-2">
			<div class="space-y-2">
				<label for="phone_number" class="block text-sm font-medium text-gray-700"
					>Phone Number <label
						for="phone_number"
						class="inline text-sm font-medium italic text-gray-500">(required)</label
					></label
				>
				<input
					name="phone_number"
					bind:value={phone_number}
					class="w-full rounded-lg border px-4 py-2 text-gray-700 outline-none focus:ring-2 focus:ring-secondary-500"
					type="tel"
					placeholder="+65XXXXXXXX"
					required
				/>
			</div>
			<button
				type="submit"
				onclick={sendVerificationCode}
				class="w-full rounded-lg bg-secondary-600 py-2 font-medium text-white hover:bg-secondary-700 disabled:opacity-50"
				disabled={verifySent}
			>
				{verifySent ? 'Please wait 5 minutes' : 'Send Code via SMS'}
			</button>
		</div>
	</div>
</div>

{#if verifySent}
	<div class="container mx-auto mt-5 space-y-4">
		<div class="rounded-lg bg-white p-4 shadow-lg">
			<p class="mt-4 text-gray-600">Please enter your verification code</p>
			<div class="mt-4 space-y-2">
				<div class="space-y-2">
					<label for="verify_code" class="block text-sm font-medium text-gray-700"
						>Code verification<label
							for="verify_code"
							class="inline text-sm font-medium italic text-gray-500">(required)</label
						></label
					>
					<input
						name="verify_code"
						bind:value={verify_code}
						class="w-full rounded-lg border px-4 py-2 text-gray-700 outline-none focus:ring-2 focus:ring-secondary-500"
						type="tel"
						placeholder="XXXXX"
						required
					/>
				</div>
				<button
					type="submit"
					onclick={verifyVerificationCode}
					class="w-full rounded-lg bg-secondary-600 py-2 font-medium text-white hover:bg-secondary-700"
				>
					Send Code via SMS
				</button>
			</div>
		</div>
	</div>
{/if}
