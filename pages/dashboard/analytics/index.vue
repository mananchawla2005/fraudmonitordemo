<template>
    <div class="p-6">
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
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { Line } from 'vue-chartjs'
  import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
  
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)
  
  const startDate = ref(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10))
  const endDate = ref(new Date().toISOString().slice(0, 10))
  const chartData = ref(null)
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    }
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
      console.log(response)
  
      if (response.success) {
        chartData.value = {
          labels: response.data.map(item => item.date),
          datasets: [
            {
              label: 'Accepted Transactions',
              data: response.data.map(item => item.accepted),
              borderColor: '#22c55e',
              backgroundColor: '#22c55e',
              tension: 0.1
            },
            {
              label: 'Refused Transactions',
              data: response.data.map(item => item.refused),
              borderColor: '#ef4444',
              backgroundColor: '#ef4444',
              tension: 0.1
            }
          ]
        }
      }
    } catch (error) {
      console.error('Failed to fetch analytics data')
    }
  }
  
  onMounted(() => {
    fetchData()
  })
  </script>