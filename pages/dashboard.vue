<script setup>
definePageMeta({
  middleware: ["protected"]
});

const user = useUser();
const sidebarOpen = ref(true);
const route = useRoute();

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
}

async function logout() {
  await $fetch("/api/logout", {
    method: "POST"
  });
  await navigateTo("/login");
}

const isActive = (path) => {
  if (path === '#' && route.path === '/dashboard') return true;
  return route.path.startsWith(path);
}
</script>

<template>
  <div class="min-h-screen flex bg-gray-100">
    <!-- Sidebar -->
    <div 
      :class="[
        'bg-black text-white transition-all duration-300 ease-in-out flex flex-col',
        sidebarOpen ? 'w-64' : 'w-16'
      ]"
    >
      <!-- Sidebar header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-800">
        <div class="flex items-center" :class="[
              'transition-all duration-300',
              sidebarOpen ? 'block' : 'hidden'
            ]" >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" clip-rule="evenodd" />
          </svg>
          <span 
            :class="[
              'font-bold ml-2 text-xl text-white transition-all duration-300',
              sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'
            ]"
          >
            FraudMonitor
          </span>
        </div>
        <div @click="toggleSidebar">

            <button  class="text-gray-400 hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>
        </div>
      </div>
      
      <!-- Sidebar content -->
      <nav class="flex-1 py-4 px-2 overflow-y-auto overflow-x-hidden">
        <div class="space-y-1">
          <NuxtLink to="/dashboard" :class="[
            'flex items-center px-2 py-3 text-base font-medium rounded-md group',
            isActive('/dashboard') && !route.path.includes('/dashboard/') ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
          ]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" :class="isActive('/dashboard') && !route.path.includes('/dashboard/') ? 'text-gray-400' : 'text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span :class="{ 'hidden': !sidebarOpen, 'block': sidebarOpen }">
              Dashboard
            </span>
          </NuxtLink>
          
          <NuxtLink to="/dashboard/analytics" :class="[
            'flex items-center px-2 py-3 text-base font-medium rounded-md group',
            isActive('/dashboard/analytics') ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
          ]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" :class="isActive('/dashboard/analytics') ? 'text-gray-400' : 'text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span :class="{ 'hidden': !sidebarOpen, 'block': sidebarOpen }">
              Analytics
            </span>
          </NuxtLink>
          
          <NuxtLink to="/dashboard/transaction" :class="[
            'flex items-center px-2 py-3 text-base font-medium rounded-md group',
            isActive('/dashboard/transaction') ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
          ]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" :class="isActive('/dashboard/transaction') ? 'text-gray-400' : 'text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span :class="{ 'hidden': !sidebarOpen, 'block': sidebarOpen }">
              Transactions
            </span>
          </NuxtLink>
          
          <NuxtLink to="/dashboard/reporting" :class="[
            'flex items-center px-2 py-3 text-base font-medium rounded-md group',
            isActive('/dashboard/reporting') ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
          ]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" :class="isActive('/dashboard/reporting') ? 'text-gray-400' : 'text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span :class="{ 'hidden': !sidebarOpen, 'block': sidebarOpen }">
              Reporting
            </span>
          </NuxtLink>
          
          <NuxtLink to="/dashboard/settings" :class="[
            'flex items-center px-2 py-3 text-base font-medium rounded-md group',
            isActive('/dashboard/settings') ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
          ]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" :class="isActive('/dashboard/settings') ? 'text-gray-400' : 'text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span :class="{ 'hidden': !sidebarOpen, 'block': sidebarOpen }">
              Settings
            </span>
          </NuxtLink>
          
        </div>
      </nav>
      
      <!-- User profile section at bottom of sidebar -->
      <div class="flex-shrink-0 border-t border-gray-800 p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="h-10 w-10 rounded-full bg-black border border-gray-700 flex items-center justify-center text-white font-bold">
              {{ user.name.charAt(0) }}
            </div>
          </div>
          <div :class="{ 'hidden': !sidebarOpen, 'ml-3': sidebarOpen }">
            <p class="text-sm font-medium text-green-400">{{ user.name }}</p>
            <button @click="logout" class="text-xs text-gray-400 hover:text-white">
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <NuxtPage />
  </div>
</template>