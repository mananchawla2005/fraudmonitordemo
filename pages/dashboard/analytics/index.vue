<template>
    <div class="p-6 w-4/5">
      <div class="grid grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow-lg p-6">
          <div class="mb-4">
            <h2 class="text-2xl font-semibold">Fraud Detection Analytics</h2>
          </div>
          <div class="flex gap-4 mb-6">
            <input type="date" v-model="startDate" class="border rounded px-3 py-2" />
            <input type="date" v-model="endDate" class="border rounded px-3 py-2" />
            <button @click="fetchData" class="bg-blue-500 text-white px-4 py-2 rounded">
              Update
            </button>
          </div>
          <div class="h-[400px]">
            <Line v-if="chartData" :data="chartData" :options="chartOptions" />
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h3 class="text-xl font-semibold mb-4">Inquiries Overview</h3>
          <div class="text-center mb-4">
            <p class="text-4xl font-bold">{{ totalInquiries }}</p>
            <p class="text-gray-500">Total Inquiries</p>
          </div>
          <div class="flex justify-center mb-4">
            <div class="w-24 h-24">
              <Doughnut v-if="overviewData" :data="overviewData" :options="overviewOptions" />
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="flex items-center gap-2">
                <span class="w-3 h-3 bg-green-500 rounded-full"></span> Accepted
              </span>
              <span>{{ accepted }} ({{ acceptedPercentage }}%)</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="flex items-center gap-2">
                <span class="w-3 h-3 bg-yellow-500 rounded-full"></span> Review
              </span>
              <span>{{ review }} ({{ reviewPercentage }}%)</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="flex items-center gap-2">
                <span class="w-3 h-3 bg-red-500 rounded-full"></span> Refused
              </span>
              <span>{{ refused }} ({{ refusedPercentage }}%)</span>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-6 bg-white rounded-lg shadow-lg p-6">
        <h3 class="text-xl font-semibold mb-4">Payment Method Analysis</h3>
        <div class="h-[300px]">
          <Bar v-if="paymentMethodData" :data="paymentMethodData" :options="paymentMethodOptions" />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-6 mt-6">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h3 class="text-xl font-semibold mb-4">Fraud Distribution by Bank</h3>
        <div class="h-[300px]">
          <Pie v-if="bankFraudData" :data="bankFraudData" :options="bankFraudOptions" />
        </div>
      </div>
      <div class=" bg-white rounded-lg shadow-lg p-6">
        <h3 class="text-xl font-semibold mb-4">Transaction Channels</h3>
        <div class="h-[300px]">
          <Bar v-if="channelData" :data="channelData" :options="channelOptions" />
        </div>
      </div>
    </div>
    </div>
  </template>
  
  <script setup>
import { ref, onMounted } from 'vue'
import { Line, Doughnut, Bar, Pie } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement)
  
  const startDate = ref(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10))
  const endDate = ref(new Date().toISOString().slice(0, 10))
  const chartData = ref(null)
  const overviewData = ref(null)
  const totalInquiries = ref(0)
  const accepted = ref(0)
  const review = ref(0)
  const refused = ref(0)
  const acceptedPercentage = ref(0)
  const reviewPercentage = ref(0)
  const refusedPercentage = ref(0)
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 3
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    },
    spanGaps: true
  }
  
  const overviewOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    }
  }

  const paymentMethodData = ref(null)
const paymentMethodOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Number of Transactions'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Payment Method'
      }
    }
  },
  plugins: {
    legend: {
      position: 'top'
    }
  }
}

const bankFraudData = ref(null)
const bankFraudOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right'
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const label = context.label || ''
          const value = context.parsed || 0
          const total = context.dataset.data.reduce((a, b) => a + b, 0)
          const percentage = ((value / total) * 100).toFixed(1)
          return `${label}: ${value} (${percentage}%)`
        }
      }
    }
  }
}

const generateColors = (length) => {
    const colors = [ '#a3be8c', '#78866b', '#f4d7c2', '#d9b99b', '#232323', '#2f4f4f', '#b0b0b0' ];

  return Array.from({ length }, (_, i) => colors[i % colors.length])
}
const generateShades = (length) => {
  const baseColor = 'rgb(0, 0, 0)'
  return Array.from({ length }, (_, i) => {
    const opacity = 1 - (i * 0.15)
    return baseColor.replace(')', `, ${opacity})`)
  })
}

const channelData = ref(null)
const channelOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  scales: {
    x: {
      stacked: true,
      title: {
        display: true,
        text: 'Number of Transactions'
      }
    },
    y: {
      stacked: true,
      title: {
        display: true,
        text: 'Channel'
      }
    }
  },
  plugins: {
    legend: {
      position: 'top'
    },
    tooltip: {
      mode: 'index'
    }
  }
}
const mainColors = {
  safe: '#94a3b8',
  fraud: '#fca5a5',
  review: '#fde68a',
  subtle: ['#94a3b8', '#bfdbfe', '#ddd6fe', '#fbcfe8', '#86efac', '#fde68a', '#fca5a5', '#f1f5f9', '#e2e8f0', '#cbd5e1']
}
  const fetchData = async () => {
  try {
    const response = await $fetch('/api/analytics/full', {
      method: 'POST',
      body: {
        startDate: startDate.value,
        endDate: endDate.value
      }
    })

    if (response.success) {
      const sortedData = response.data.sort((a, b) => new Date(a.date) - new Date(b.date))
      chartData.value = {
        labels: sortedData.map(item => item.date),
        datasets: [
    {
      label: 'Accepted Transactions',
      data: sortedData.map(item => item.accepted),
      borderColor: mainColors.safe,
      backgroundColor: `${mainColors.safe}1a`,
      fill: false,
      borderWidth: 2,
      pointBackgroundColor: mainColors.safe
    },
    {
      label: 'Refused Transactions',
      data: sortedData.map(item => item.refused),
      borderColor: mainColors.fraud,
      backgroundColor: `${mainColors.fraud}1a`,
      fill: false,
      borderWidth: 2,
      pointBackgroundColor: mainColors.fraud
    }
  ]
      }

      if (response.overview) {
        accepted.value = response.overview.accepted || 0
        review.value = response.overview.review || 0
        refused.value = response.overview.refused || 0
        totalInquiries.value = accepted.value + review.value + refused.value
        acceptedPercentage.value = ((accepted.value / totalInquiries.value) * 100).toFixed(0)
        reviewPercentage.value = ((review.value / totalInquiries.value) * 100).toFixed(0)
        refusedPercentage.value = ((refused.value / totalInquiries.value) * 100).toFixed(0)

        overviewData.value = {
  labels: ['Accepted', 'Review', 'Refused'],
  datasets: [{
    data: [accepted.value, review.value, refused.value],
    backgroundColor: [mainColors.safe, mainColors.review, mainColors.fraud]
  }]
}
      }

      if (response.paymentMethods) {
  paymentMethodData.value = {
    labels: response.paymentMethods.map(item => item.transaction_payment_mode),
    datasets: [{
      label: 'Payment Methods',
      data: response.paymentMethods.map(item => item.total),
      backgroundColor: mainColors.subtle.slice(0, response.paymentMethods.length),
      borderWidth: 1
    }]
  }
}
if (response.bankFraud) {
  bankFraudData.value = {
    labels: response.bankFraud.map(item => item.payment_gateway_bank),
    datasets: [{
      data: response.bankFraud.map(item => item.fraud_count),
      backgroundColor: mainColors.subtle.slice(0, response.bankFraud.length)
    }]
  }
}

if (response.channels) {
  channelData.value = {
    labels: response.channels.map(item => item.transaction_channel),
    datasets: [
      {
        label: 'Safe Transactions',
        data: response.channels.map(item => item.safe_count),
        backgroundColor: mainColors.safe,
        borderWidth: 1
      },
      {
        label: 'Fraudulent Transactions',
        data: response.channels.map(item => item.fraud_count),
        backgroundColor: mainColors.fraud,
        borderWidth: 1
      }
    ]
  }
}
    }
  } catch (error) {
    console.error('Failed to fetch analytics data', error)
  }
}
  
  onMounted(() => {
    fetchData()
  })
  </script>