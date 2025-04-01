<script lang="ts">
	import { goto } from '$app/navigation';
	import { fade, slide } from 'svelte/transition';
	import { Menu, X, User, LogOut, ChevronDown } from 'lucide-svelte';
	import { onMount } from 'svelte';
	
	let { children, data } = $props();
	let mobileMenuOpen = $state(false);
	let profileMenuOpen = $state(false);
	let scrolled = $state(false);
	let profileDropdownRef = $state(null);
	
	async function logout() {
	  const { error } = await data.supabase.auth.signOut();
	  if (error) {
		console.error(error);
	  } else {
		goto('/');
	  }
	}
	
	function toggleMobileMenu() {
	  mobileMenuOpen = !mobileMenuOpen;
	  if (mobileMenuOpen) profileMenuOpen = false;
	}
	
	function toggleProfileMenu() {
	  profileMenuOpen = !profileMenuOpen;
	}
	
	function closeAllMenus() {
	  mobileMenuOpen = false;
	  profileMenuOpen = false;
	}
	
	function handleClickOutside(event) {
	  if (profileDropdownRef && !profileDropdownRef.contains(event.target)) {
		profileMenuOpen = false;
	  }
	}
	
	onMount(() => {
	  document.addEventListener('click', handleClickOutside);
	  
	  return () => {
		document.removeEventListener('click', handleClickOutside);
	  };
	});
	
	// Get user initials for avatar
	const userInitials = $state(data.user?.user_metadata.name 
    ? data.user.user_metadata.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : '??');
</script>
  
<header class="sticky top-0 z-50 w-full {scrolled ? 'shadow-md' : ''} transition-all duration-300">
	<div class="bg-white border-b border-gray-100">
	  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between h-16">
		  <!-- Logo and main navigation -->
		  <div class="flex items-center">
			<a href="/" class="flex-shrink-0 flex items-center">
			  <span class="text-xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">Carpool Asia</span>
			</a>
			
			<!-- Desktop Navigation -->
			<nav class="hidden md:ml-8 md:flex md:space-x-8">
			  <a href="/private/trips" class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 border-b-2 border-transparent hover:border-orange-400 transition-colors">
				Trips
			  </a>
			  
			</nav>
		  </div>
		  
		  <!-- User profile and mobile menu button -->
		  <div class="flex items-center">
			<!-- Mobile menu button -->
			<button 
			  type="button" 
			  class="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
			  onclick={toggleMobileMenu}
			  aria-expanded={mobileMenuOpen}
			>
			  <span class="sr-only">{mobileMenuOpen ? 'Close main menu' : 'Open main menu'}</span>
			  {#if mobileMenuOpen}
				<X size={20} />
			  {:else}
				<Menu size={20} />
			  {/if}
			</button>
			
			<!-- Profile dropdown -->
			<div class="ml-3 relative hidden md:block" >
			  <div bind:this={profileDropdownRef}>
				<button 
				  type="button" 
				  class="flex text-sm rounded-full focus:outline-none group items-center"
				  onclick={toggleProfileMenu}
				  aria-expanded={profileMenuOpen}
				>
				  <div class="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-yellow-300 flex items-center justify-center text-white font-medium">
					{userInitials}
				  </div>
				  <ChevronDown size={16} class="ml-1 text-gray-500 group-hover:text-gray-700 transition-colors" />
				</button>
			  </div>
			  
			  {#if profileMenuOpen}
				<div 
				  class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
				  transition:fade={{ duration: 150 }}
				>
				  <div class="py-1" role="menu" aria-orientation="vertical">
					<a href="/private/profile" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
					  <User size={16} class="mr-2 text-gray-500" />
					  <span>Profile</span>
					</a>
					<button 
					  onclick={logout} 
					  class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
					  role="menuitem"
					>
					  <LogOut size={16} class="mr-2 text-gray-500" />
					  <span>Logout</span>
					</button>
				  </div>
				</div>
			  {/if}
			</div>
		  </div>
		</div>
	  </div>
	  
	  <!-- Mobile menu -->
	  {#if mobileMenuOpen}
		<div class="md:hidden" transition:slide={{ duration: 200 }}>
		  <div class="pt-2 pb-3 space-y-1">
			<a 
			  href="/private/trips" 
			  class="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
			  onclick={closeAllMenus}
			>
			  Trips
			</a>
	
		  </div>
		  
		  <!-- Mobile profile section -->
		  <div class="pt-4 pb-3 border-t border-gray-200">
			<div class="flex items-center px-4">
			  <div class="flex-shrink-0">
				<div class="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-yellow-300 flex items-center justify-center text-white font-medium">
				  {userInitials}
				</div>
			  </div>
			  <div class="ml-3">
				<div class="text-base font-medium text-gray-800">{data.user?.user_metadata.name || 'User'}</div>
				<div class="text-sm font-medium text-gray-500">{data.user?.email || ''}</div>
			  </div>
			</div>
			<div class="mt-3 space-y-1">
			  <a 
				href="/private/profile" 
				class="flex items-center px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
				onclick={closeAllMenus}
			  >
				<User size={16} class="mr-2 text-gray-500" />
				<span>Profile</span>
			  </a>
			  <button 
				onclick={logout} 
				class="flex w-full items-center px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
			  >
				<LogOut size={16} class="mr-2 text-gray-500" />
				<span>Logout</span>
			  </button>
			</div>
		  </div>
		</div>
	  {/if}
	</div>
</header>
  
<main class="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
	{@render children()}
</main>