<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import type { User } from '@/interfaces/interfaces'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const props = defineProps({
  users: {
    type: Array as () => User[],
    required: true
  }
})

// Check if we have any users
const hasData = computed(() => props.users.length > 0)

// Create user growth data
const chartData = computed(() => {
  // Mock data - in a real app, this would use the actual join dates
  // Here we're just creating some placeholder data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const currentMonth = new Date().getMonth()

  // Get last 6 months
  const labels = []
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12
    labels.push(months[monthIndex])
  }

  // Mock growth data - in a real app would use actual joinDate
  const data = [
    Math.floor(props.users.length * 0.1),
    Math.floor(props.users.length * 0.2),
    Math.floor(props.users.length * 0.3),
    Math.floor(props.users.length * 0.5),
    Math.floor(props.users.length * 0.7),
    props.users.length
  ]

  return {
    labels,
    datasets: [
      {
        label: 'User Growth',
        backgroundColor: 'rgba(92, 106, 196, 0.2)',
        borderColor: '#5C6AC4',
        borderWidth: 2,
        pointBackgroundColor: '#5C6AC4',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        tension: 0.3,
        fill: true,
        data
      }
    ]
  }
})

// Chart.js options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      titleColor: '#111827',
      bodyColor: '#4B5563',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      padding: 12,
      boxPadding: 5,
      usePointStyle: true
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          family: 'Inter, system-ui, sans-serif'
        }
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        borderDash: [2, 2],
        color: 'rgba(0, 0, 0, 0.05)'
      },
      ticks: {
        font: {
          family: 'Inter, system-ui, sans-serif'
        }
      }
    }
  }
}
</script>

<template>
  <div v-if="hasData" class="h-64">
    <Line :data="chartData" :options="chartOptions" />
  </div>
  <div v-else class="h-64 flex flex-col items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
    <p class="text-gray-500 text-sm">No growth data available</p>
  </div>
</template>
