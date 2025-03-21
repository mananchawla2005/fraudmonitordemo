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
          
          <div class="mt-6 border-t pt-4">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-lg font-medium text-gray-800">Custom Rules</h3>
              <button 
                type="button" 
                @click="addCustomRule"
                class="text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
              >
                Add Rule
              </button>
            </div>
            
            <div v-for="(rule, index) in customRules" :key="index" class="bg-gray-50 p-3 rounded-md mb-3">
              <div class="flex justify-between items-center mb-2">
                <span class="font-medium text-gray-700">Rule {{ index + 1 }}</span>
                <button 
                  type="button" 
                  @click="removeCustomRule(index)" 
                  class="text-red-500 hover:text-red-700"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label class="block text-xs font-medium text-gray-600">Field</label>
                  <select v-model="rule.field" class="w-full px-2 py-1 border border-gray-300 rounded-md text-sm">
                    <option value="transaction_amount">Amount</option>
                    <option value="transaction_channel">Channel</option>
                    <option value="transaction_payment_mode">Payment Mode</option>
                    <option value="payer_email">Email</option>
                    <option value="payer_mobile">Mobile</option>
                    <option value="payer_device">Device</option>
                    <option value="payer_browser">Browser</option>
                    <option value="payment_gateway_bank">Bank</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-xs font-medium text-gray-600">Condition</label>
                  <select v-model="rule.condition" class="w-full px-2 py-1 border border-gray-300 rounded-md text-sm">
                    <option value="equals">Equals</option>
                    <option value="contains">Contains</option>
                    <option value="greater_than">Greater Than</option>
                    <option value="less_than">Less Than</option>
                    <option value="starts_with">Starts With</option>
                    <option value="ends_with">Ends With</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-xs font-medium text-gray-600">Value</label>
                  <input 
                    v-model="rule.value" 
                    type="text" 
                    class="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                    placeholder="Value to match"
                  />
                </div>
              </div>
              
              <div class="mt-2">
                <label class="block text-xs font-medium text-gray-600">Score Impact</label>
                <input 
                  v-model="rule.score_impact" 
                  type="number" 
                  step="0.1" 
                  class="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                  placeholder="Score impact (e.g., 0.5, -0.3)"
                />
              </div>
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
  
  const customRules = ref([]);
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
    customRules.value = [];
    fraudResult.value = null;
  };
  
  const addCustomRule = () => {
    customRules.value.push({
      field: 'transaction_amount',
      condition: 'greater_than',
      value: '',
      score_impact: 0.5
    });
  };
  
  const removeCustomRule = (index) => {
    customRules.value.splice(index, 1);
  };
  
  const submitTransaction = async () => {
    loading.value = true;
    try {
      const payload = {
        ...transaction.value,
        custom_rules: customRules.value
      };
      
      const response = await fetch('/api/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
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