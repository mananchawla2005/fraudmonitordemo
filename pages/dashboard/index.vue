<script setup>
definePageMeta({
    middleware: ["protected"]
});

const user = useUser();
const recentTransactions = ref([]);
const isLoading = ref(true);

async function fetchRecentTransactions() {
  try {
    isLoading.value = true;
    const data = await $fetch('/api/analytics/recent', {
      method: 'POST',
      body: { limit: 5 }
    });
    
    if (data.success) {
      recentTransactions.value = data.data;
    }
  } catch (error) {
    console.error('Error fetching recent transactions:', error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchRecentTransactions();
});

function formatDate(dateString) {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const today = new Date();
  
  if (date.toDateString() === today.toDateString()) {
    return `Today at ${hours}:${minutes}`;
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${hours}:${minutes}`;
  }
  
  return `${date.toLocaleDateString()} at ${hours}:${minutes}`;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
}
</script>
<template>
    <div class="flex-1 overflow-auto bg-white">
        <div class="py-6 px-4 sm:px-6 lg:px-8">
            <div class="mb-6 border-b border-gray-200 pb-5">
                <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p class="mt-2 text-sm text-gray-500">Welcome back, {{ user.name }}!</p>
            </div>

            <!-- Dashboard content -->
            <div class="">
                <!-- Stats cards -->
                <ViewDashboardAnalytics />
            </div>

            <div class="mt-8">
                <h2 class="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
                <div class="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul role="list" class="divide-y divide-gray-200">
                        <div v-if="isLoading" class="px-4 py-6 text-center text-gray-500">
                            Loading recent transactions...
                        </div>
                        <li v-else-if="recentTransactions.length === 0" class="px-4 py-6 text-center text-gray-500">
                            No recent transactions found
                        </li>
                        <li v-else v-for="transaction in recentTransactions" :key="transaction.id">
                            <a href="#" class="block hover:bg-gray-50">
                                <div class="px-4 py-4 sm:px-6">
                                    <div class="flex items-center justify-between">
                                        <p class="text-sm font-medium text-green-600 truncate">
                                            Transaction #{{ transaction.id }}
                                        </p>
                                        <div class="ml-2 flex-shrink-0 flex">
                                            <p
                                                :class="`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    transaction.isFraud 
                                                    ? 'bg-red-100 text-red-800' 
                                                    : 'bg-green-100 text-green-800'
                                                }`">
                                                {{ transaction.isFraud ? 'Fraudulent' : 'Legitimate' }}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="mt-2 sm:flex sm:justify-between">
                                        <div class="sm:flex">
                                            <p class="flex items-center text-sm text-gray-500">
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                {{ formatCurrency(transaction.amount) }}
                                            </p>
                                            <p v-if="transaction.channel" class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                                {{ transaction.channel }}
                                            </p>
                                        </div>
                                        <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p>
                                                {{ formatDate(transaction.date) }}
                                            </p>
                                        </div>
                                    </div>
                                    <div v-if="transaction.isFraud && transaction.fraudReason" class="mt-2">
                                        <p class="text-sm text-red-700">
                                          Fraud reason: {{ transaction.fraudReason }} 
                                          <span v-if="transaction.fraudScore" class="text-xs">(Score: {{ transaction.fraudScore.toFixed(2) }})</span>
                                        </p>
                                    </div>
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>