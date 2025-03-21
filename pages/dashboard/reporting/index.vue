<template>
  <div class="container mx-auto p-4 max-w-7xl">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Fraud Reports</h1>
      <button @click="openReportModal" class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
        New Report
      </button>
    </div>

    <div class="bg-white shadow-md rounded-lg overflow-hidden mb-6">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Reported</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody v-if="reports.length > 0" class="bg-white divide-y divide-gray-200">
            <tr v-for="report in reports" :key="report.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ report.id.substring(0, 8) }}...
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ report.transaction_id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(report.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ report.reporting_entity_id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="getStatusClass(report)" 
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ getStatusText(report) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-900" @click="viewReportDetails(report)">View</button>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                <div v-if="loading" class="flex justify-center items-center py-4">
                  <svg class="animate-spin h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <div v-else>No fraud reports found</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="px-6 py-4 flex items-center justify-between border-t border-gray-200">
        <div class="text-sm text-gray-700">
          Showing page {{ pagination.page }} of {{ pagination.totalPages }} 
          ({{ pagination.total }} total reports)
        </div>
        <div class="flex space-x-2">
          <button 
            @click="changePage(pagination.page - 1)" 
            :disabled="pagination.page <= 1" 
            :class="pagination.page <= 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'" 
            class="px-3 py-1 rounded-md text-sm font-medium"
          >
            Previous
          </button>
          <button 
            @click="changePage(pagination.page + 1)" 
            :disabled="pagination.page >= pagination.totalPages"
            :class="pagination.page >= pagination.totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
            class="px-3 py-1 rounded-md text-sm font-medium"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <NewReport 
      :show="showReportModal" 
      @close="closeReportModal" 
      @report-added="reportAdded" 
    />
    
    <div v-if="selectedReport && showDetailsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-800">Report Details</h2>
          <button @click="showDetailsModal = false" class="text-gray-500 hover:text-gray-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <dl class="grid grid-cols-2 gap-x-4 gap-y-4">
          <div>
            <dt class="text-sm font-medium text-gray-500">Report ID</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ selectedReport.id }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Created On</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ formatDate(selectedReport.created_at) }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Transaction ID</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ selectedReport.transaction_id }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Reporting Entity</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ selectedReport.reporting_entity_id }}</dd>
          </div>
          <div class="col-span-2">
            <dt class="text-sm font-medium text-gray-500">Report Status</dt>
            <dd class="mt-1">
              <span :class="getStatusClass(selectedReport)" class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ getStatusText(selectedReport) }}
              </span>
              <span v-if="selectedReport.failure_code" class="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs leading-5 font-semibold rounded-full">
                Error Code: {{ selectedReport.failure_code }}
              </span>
            </dd>
          </div>
          <div class="col-span-2">
            <dt class="text-sm font-medium text-gray-500">Fraud Details</dt>
            <dd class="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded whitespace-pre-wrap">{{ selectedReport.fraud_details || 'No details provided' }}</dd>
          </div>
          <div v-if="selectedReport.payer_email" class="col-span-2 md:col-span-1">
            <dt class="text-sm font-medium text-gray-500">Payer Email</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ selectedReport.payer_email }}</dd>
          </div>
          <div v-if="selectedReport.payer_mobile" class="col-span-2 md:col-span-1">
            <dt class="text-sm font-medium text-gray-500">Payer Mobile</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ selectedReport.payer_mobile }}</dd>
          </div>
          <div v-if="selectedReport.transaction_amount" class="col-span-2 md:col-span-1">
            <dt class="text-sm font-medium text-gray-500">Amount</dt>
            <dd class="mt-1 text-sm text-gray-900 font-medium">{{ formatCurrency(selectedReport.transaction_amount) }}</dd>
          </div>
          <div v-if="selectedReport.transaction_date" class="col-span-2 md:col-span-1">
            <dt class="text-sm font-medium text-gray-500">Transaction Date</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ formatDate(selectedReport.transaction_date) }}</dd>
          </div>
          <div v-if="selectedReport.is_fraud_reported !== undefined" class="col-span-2">
            <dt class="text-sm font-medium text-gray-500">Fraud Reported</dt>
            <dd class="mt-1 text-sm text-gray-900">
              <span :class="selectedReport.is_fraud_reported ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'" class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ selectedReport.is_fraud_reported ? 'Yes' : 'No' }}
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<script setup>
const reports = ref([]);
const showReportModal = ref(false);
const showDetailsModal = ref(false);
const selectedReport = ref(null);
const loading = ref(false);

const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0
});

onMounted(() => {
  loadReports();
});

const openReportModal = () => {
  showReportModal.value = true;
};

const closeReportModal = () => {
  showReportModal.value = false;
};

const reportAdded = () => {
  loadReports();
};

const loadReports = async () => {
  loading.value = true;
  try {
    const response = await fetch('/api/reports/list', {
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
    reports.value = data.reports;
    pagination.value = {
      page: data.page,
      pageSize: data.pageSize,
      total: data.total,
      totalPages: data.totalPages
    };
  } catch (error) {
    console.error('Error loading reports:', error);
  } finally {
    loading.value = false;
  }
};

const changePage = (page) => {
  if (page < 1 || page > pagination.value.totalPages) return;
  pagination.value.page = page;
  loadReports();
};

const viewReportDetails = (report) => {
  selectedReport.value = report;
  showDetailsModal.value = true;
};

const getStatusClass = (report) => {
  if (report.failure_code) {
    return 'bg-red-100 text-red-800';
  } else if (report.reporting_acknowledged) {
    return 'bg-green-100 text-green-800';
  } else {
    return 'bg-yellow-100 text-yellow-800';
  }
};

const getStatusText = (report) => {
  if (report.failure_code) {
    return report.failure_code === 404 ? 'Transaction Not Found' : 'Processing Error';
  } else if (report.reporting_acknowledged) {
    return 'Acknowledged';
  } else {
    return 'Pending';
  }
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