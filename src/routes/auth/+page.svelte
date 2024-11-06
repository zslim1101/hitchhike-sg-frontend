<script>
	let email = '';
	let password = '';
</script>

<form method="POST" action="?/login" class="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8 space-y-6">
	<h2 class="text-2xl font-semibold text-gray-800 text-center">Login</h2>

	<div class="space-y-2">
		<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
		<input
			name="email"
			type="email"
			class="w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
			required
		/>
	</div>

	<div class="space-y-2">
		<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
		<input
        id="password"
			name="password"
			type="password"
			class="w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
			required
		/>
	</div>

	<div class="flex justify-between items-center space-x-4">
		<button type="submit" class="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
			Login
		</button>
		<button formaction="?/signup" class="w-full py-2 bg-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-400">
			Sign Up
		</button>
	</div>
</form>
