<template>
    <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Report Fraud</h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
  
        <form @submit.prevent="submitReport">
          <div class="space-y-4 mb-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Transaction ID*</label>
              <input v-model="report.transaction_id" required type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
  
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Reporting Entity ID*</label>
              <input v-model="report.reporting_entity_id" required type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
  
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Fraud Details*</label>
              <textarea v-model="report.fraud_details" required class="w-full px-3 py-2 border border-gray-300 rounded-md h-32"></textarea>
            </div>
          </div>
  
          <div class="flex justify-end gap-3 mt-6">
            <button type="button" @click="closeModal" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700" :disabled="loading">
              {{ loading ? 'Submitting...' : 'Submit Report' }}
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
  
  const emit = defineEmits(['close', 'report-added']);
  
  const report = ref({
    transaction_id: '',
    reporting_entity_id: '',
    fraud_details: '',
    is_fraud_reported: true,
    failure_code: null
  });
  
  const loading = ref(false);
  
  const closeModal = () => {
    emit('close');
    resetForm();
  };
  
  const resetForm = () => {
    report.value = {
      transaction_id: '',
      reporting_entity_id: '',
      fraud_details: '',
      is_fraud_reported: true,
      failure_code: null
    };
  };
  
  const submitReport = async () => {
    loading.value = true;
    try {
      const reportData = {
        transaction_id: report.value.transaction_id,
        reporting_entity_id: report.value.reporting_entity_id,
        fraud_details: report.value.fraud_details
      };
      
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      await response.json();
      emit('report-added');
      closeModal();
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      loading.value = false;
    }
  };
  </script>