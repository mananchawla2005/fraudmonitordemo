<template>
    <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">New Transaction</h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
  
        <form @submit.prevent="submitTransaction">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Transaction ID</label>
              <input v-model="transaction.transaction_id" required type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
  
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Date</label>
              <input v-model="transaction.transaction_date" required type="datetime-local" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
  
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Amount</label>
              <input v-model="transaction.transaction_amount" required type="number" step="0.01" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
  
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Channel</label>
              <input v-model="transaction.transaction_channel" required type="text" placeholder="Online, Mobile, In-Store, etc." class="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
  
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Payment Mode</label>
              <input v-model="transaction.transaction_payment_mode" required type="text" placeholder="Card, UPI, NetBanking, etc." class="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
  
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Gateway Bank</label>
              <input v-model="transaction.payment_gateway_bank" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
  
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Payer Email</label>
              <input v-model="transaction.payer_email" type="email" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
  
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Payer Mobile</label>
              <input v-model="transaction.payer_mobile" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
  
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Card Brand</label>
              <input v-model="transaction.payer_card_brand" type="text" placeholder="Visa, Mastercard, Amex, etc." class="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
  
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Device</label>
              <input v-model="transaction.payer_device" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
  
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Browser</label>
              <input v-model="transaction.payer_browser" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
  
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Payee ID</label>
              <input v-model="transaction.payee_id" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
          </div>
  
          <div class="flex justify-end gap-3 mt-6">
            <button type="button" @click="closeModal" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" :disabled="loading">
              {{ loading ? 'Processing...' : 'Submit Transaction' }}
            </button>
          </div>
        </form>
  
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    show: Boolean
  });
  
  const emit = defineEmits(['close', 'transaction-added']);
  
  const transaction = ref({
    transaction_id: '',
    transaction_date: '',
    transaction_amount: '',
    transaction_channel: 'Online',
    transaction_payment_mode: 'Card',
    payment_gateway_bank: '',
    payer_email: '',
    payer_mobile: '',
    payer_card_brand: '',
    payer_device: '',
    payer_browser: '',
    payee_id: ''
  });
  
  const loading = ref(false);
  const fraudResult = ref(null);
  
  const closeModal = () => {
    emit('close');
    resetForm();
  };
  
  const resetForm = () => {
    transaction.value = {
      transaction_id: '',
      transaction_date: '',
      transaction_amount: '',
      transaction_channel: 'Online',
      transaction_payment_mode: 'Card',
      payment_gateway_bank: '',
      payer_email: '',
      payer_mobile: '',
      payer_card_brand: '',
      payer_device: '',
      payer_browser: '',
      payee_id: ''
    };
    fraudResult.value = null;
  };
  
  const submitTransaction = async () => {
    loading.value = true;
    try {
      const response = await fetch('/api/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction.value),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      fraudResult.value = await response.json();
      emit('transaction-added');
      resetForm();
    } catch (error) {
      console.error('Error submitting transaction:', error);
      alert('Failed to process transaction. Please try again.');
    } finally {
      loading.value = false;
    }
  };
  </script>