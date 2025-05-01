<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import type { User } from '@/interfaces/interfaces'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  users: {
    type: Array as () => User[],
    required: true
  }
})

// Check if we have any users
const hasData = computed(() => props.users.length > 0)

// User statistics
const chartData = computed(() => {
  const roleData = {
    admin: 0,
    developer: 0
  }

  props.users.forEach(user => {
    if (user.role && typeof user.role === 'string') {
      // Treat 'user' role as 'developer' for consistency
      const role = user.role.toLowerCase() === 'user' ? 'developer' : user.role.toLowerCase();
      if (role in roleData) {
        roleData[role as keyof typeof roleData]++
      }
    }
  })

  return {
    labels: Object.keys(roleData).map(role => role.charAt(0).toUpperCase() + role.slice(1)),
    datasets: [{
      backgroundColor: ['#5C6AC4', '#10B981'],
      hoverBackgroundColor: ['#4C59B4', '#00A871'],
      borderWidth: 0,
      data: Object.values(roleData)
    }]
  }
})

// Chart.js options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        padding: 15,
        font: {
          family: 'Inter, system-ui, sans-serif',
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      titleColor: '#111827',
      bodyColor: '#4B5563',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      padding: 12,
      boxPadding: 5,
      usePointStyle: true,
      callbacks: {
        label: (context: any) => {
          const label = context.label || '';
          const value = context.raw || 0;
          const total = context.dataset.data.reduce((acc: number, curr: number) => acc + curr, 0);
          const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
          return `${label}: ${value} (${percentage}%)`;
        }
      }
    }
  }
}
</script>

<template>
  <div v-if="hasData" class="h-64">
    <Pie :data="chartData" :options="chartOptions" />
  </div>
  <div v-else class="h-64 flex flex-col items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
    <p class="text-gray-500 text-sm">No user data available</p>
  </div>
</template>
