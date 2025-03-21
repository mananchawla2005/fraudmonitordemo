<template>
    <div class="container mx-auto p-4 max-w-7xl">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Transactions</h1>
        <button @click="openTransactionModal" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          New Transaction
        </button>
      </div>

      <div class="bg-white shadow-md rounded-lg overflow-hidden mb-4 p-4">
        <div class="flex flex-wrap gap-4 items-end">
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
            <input
              v-model="filters.transactionId"
              type="text"
              placeholder="Search by ID"
              class="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <div class="flex items-center gap-2">
              <input
                v-model="filters.startDate"
                type="date"
                placeholder="Start"
                class="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-blue-500 focus:border-blue-500"
              />
              <span>-</span>
              <input
                v-model="filters.endDate"
                type="date"
                placeholder="End"
                class="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 mb-1">Amount Range</label>
            <div class="flex items-center gap-2">
              <input
                v-model="filters.minAmount"
                type="number"
                placeholder="Min"
                class="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-blue-500 focus:border-blue-500"
              />
              <span>-</span>
              <input
                v-model="filters.maxAmount"
                type="number"
                placeholder="Max"
                class="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
            <input
                v-model="filters.paymentMode"
                type="text"
                placeholder="Enter payment mode"
                class="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 mb-1">Payee ID</label>
            <input
              v-model="filters.payeeId"
              type="text"
              placeholder="Enter payee ID"
              class="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 mb-1">Fraud Status</label>
            <select
              v-model="filters.fraudStatus"
              class="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All</option>
              <option value="fraud">Fraud</option>
              <option value="safe">Safe</option>
            </select>
          </div>
          <div class="flex gap-2">
            <button @click="applyFilters" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Apply Filters
            </button>
            <button @click="clearFilters" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
              Clear
            </button>
          </div>
        </div>
      </div>
  
      <div class="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div class="overflow-x-auto" style="max-height: calc(100vh - 250px);">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Mode</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payee ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payer</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fraud Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody v-if="filteredTransactions.length > 0" class="bg-white divide-y divide-gray-200">
              <tr v-for="transaction in filteredTransactions" :key="transaction.transaction_id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ transaction.transaction_id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(transaction.transaction_date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {{ formatCurrency(transaction.transaction_amount) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ transaction.transaction_payment_mode }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ transaction.payee_id || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{{ transaction.payer_email }}</div>
                  <div v-if="transaction.payer_mobile">{{ transaction.payer_mobile }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="transaction.is_fraud_predicted ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'" class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ transaction.is_fraud_predicted ? 'Fraud' : 'Safe' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ transaction.fraud_score?.toFixed(2) || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button class="text-blue-600 hover:text-blue-900" @click="viewTransactionDetails(transaction)">View</button>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="9" class="px-6 py-4 text-center text-gray-500">
                  No transactions found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div class="text-sm text-gray-700">
            Showing page {{ pagination.page }} of {{ pagination.totalPages }} 
            ({{ pagination.total }} total transactions)
          </div>
          <div class="flex space-x-2">
            <button 
              @click="changePage(pagination.page - 1)" 
              :disabled="pagination.page <= 1" 
              :class="pagination.page <= 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'" 
              class="px-3 py-1 rounded-md text-sm font-medium"
            >
              Previous
            </button>
            <button 
              @click="changePage(pagination.page + 1)" 
              :disabled="pagination.page >= pagination.totalPages"
              :class="pagination.page >= pagination.totalPages ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
              class="px-3 py-1 rounded-md text-sm font-medium"
            >
              Next
            </button>
          </div>
        </div>
      </div>
  
      <NewTransaction 
        :show="showTransactionModal" 
        @close="closeTransactionModal" 
        @transaction-added="transactionAdded" 
      />
      
      <div v-if="selectedTransaction && showDetailsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-800">Transaction Details</h2>
            <button @click="showDetailsModal = false" class="text-gray-500 hover:text-gray-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <dl class="grid grid-cols-2 gap-x-4 gap-y-4">
            <div class="col-span-2">
              <dt class="text-sm font-medium text-gray-500">Transaction ID</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ selectedTransaction.transaction_id }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Date</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ formatDate(selectedTransaction.transaction_date) }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Amount</dt>
              <dd class="mt-1 text-sm text-gray-900 font-medium">{{ formatCurrency(selectedTransaction.transaction_amount) }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Channel</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ selectedTransaction.transaction_channel }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Payment Mode</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ selectedTransaction.transaction_payment_mode }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Payee ID</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ selectedTransaction.payee_id || 'N/A' }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Payer Email</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ selectedTransaction.payer_email || 'N/A' }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Payer Mobile</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ selectedTransaction.payer_mobile || 'N/A' }}</dd>
            </div>
            <div class="col-span-2">
              <dt class="text-sm font-medium text-gray-500">Fraud Status</dt>
              <dd class="mt-1">
                <span :class="selectedTransaction.is_fraud_predicted ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'" class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ selectedTransaction.is_fraud_predicted ? 'Fraud Detected' : 'No Fraud Detected' }}
                </span>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Fraud Score</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ selectedTransaction.fraud_score?.toFixed(2) || 'N/A' }}</dd>
            </div>
            <div v-if="selectedTransaction.fraud_reason">
              <dt class="text-sm font-medium text-gray-500">Fraud Reason</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ selectedTransaction.fraud_reason }}</dd>
            </div>
            
            <div v-if="selectedTransaction.custom_rules && selectedTransaction.custom_rules.length > 0" class="col-span-2">
              <dt class="text-sm font-medium text-gray-500 mb-2">Custom Rules</dt>
              <dd class="border rounded-md overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">Field</th>
                      <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">Condition</th>
                      <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">Value</th>
                      <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">Score Impact</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    <tr v-for="(rule, i) in selectedTransaction.custom_rules" :key="i" class="text-xs">
                      <td class="px-3 py-2">{{ rule.field }}</td>
                      <td class="px-3 py-2">{{ rule.condition }}</td>
                      <td class="px-3 py-2">{{ rule.value }}</td>
                      <td class="px-3 py-2">{{ rule.score_impact }}</td>
                    </tr>
                  </tbody>
                </table>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </template>

<script setup>
const transactions = ref([]);
const filteredTransactions = ref([]);
const showTransactionModal = ref(false);
const showDetailsModal = ref(false);
const selectedTransaction = ref(null);
const loading = ref(false);

const filters = ref({
  transactionId: '',
  startDate: '',
  endDate: '',
  minAmount: '',
  maxAmount: '',
  paymentMode: '',
  payeeId: '',
  fraudStatus: ''
});

const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0
});

onMounted(() => {
  loadTransactions();
});

const openTransactionModal = () => {
  showTransactionModal.value = true;
};

const closeTransactionModal = () => {
  showTransactionModal.value = false;
};

const transactionAdded = () => {
  closeTransactionModal()
  loadTransactions();
};

const loadTransactions = async () => {
  loading.value = true;
  try {
    const response = await fetch('/api/transactions/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        page: pagination.value.page,
        pageSize: pagination.value.pageSize
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    transactions.value = data.transactions;
    filteredTransactions.value = data.transactions;
    pagination.value = {
      page: data.page,
      pageSize: data.pageSize,
      total: data.total,
      totalPages: data.totalPages
    };
  } catch (error) {
    console.error('Error loading transactions:', error);
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => {
  filteredTransactions.value = transactions.value.filter(transaction => {
    // Transaction ID filter
    if (filters.value.transactionId && !transaction.transaction_id.toLowerCase().includes(filters.value.transactionId.toLowerCase())) {
      return false;
    }
    
    // Date range filter
    if (filters.value.startDate || filters.value.endDate) {
      const transDate = new Date(transaction.transaction_date);
      if (filters.value.startDate) {
        const startDate = new Date(filters.value.startDate);
        if (transDate < startDate) return false;
      }
      if (filters.value.endDate) {
        const endDate = new Date(filters.value.endDate);
        endDate.setHours(23, 59, 59, 999); // Set to end of day
        if (transDate > endDate) return false;
      }
    }
    
    // Amount range filter
    const amount = transaction.transaction_amount;
    if (filters.value.minAmount && amount < Number(filters.value.minAmount)) {
      return false;
    }
    if (filters.value.maxAmount && amount > Number(filters.value.maxAmount)) {
      return false;
    }
    
    // Payment mode filter
    if (filters.value.paymentMode && transaction.transaction_payment_mode.toLowerCase() !== filters.value.paymentMode.toLowerCase()) {
      return false;
    }
    
    // Payee ID filter
    if (filters.value.payeeId && transaction.payee_id !== filters.value.payeeId) {
      return false;
    }
    
    // Fraud status filter
    if (filters.value.fraudStatus) {
      if (filters.value.fraudStatus === 'fraud' && !transaction.is_fraud_predicted) {
        return false;
      }
      if (filters.value.fraudStatus === 'safe' && transaction.is_fraud_predicted) {
        return false;
      }
    }
    
    return true;
  });
};

const clearFilters = () => {
  filters.value = {
    transactionId: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    paymentMode: '',
    payeeId: '',
    fraudStatus: ''
  };
  filteredTransactions.value = transactions.value;
};

const changePage = (page) => {
  if (page < 1 || page > pagination.value.totalPages) return;
  pagination.value.page = page;
  loadTransactions();
};

const viewTransactionDetails = (transaction) => {
  selectedTransaction.value = transaction;
  showDetailsModal.value = true;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return 'N/A';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};
</script>