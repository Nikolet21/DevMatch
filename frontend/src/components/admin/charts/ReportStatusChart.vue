<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  pendingCount: {
    type: Number,
    required: true
  },
  investigatingCount: {
    type: Number,
    default: 0
  },
  resolvedCount: {
    type: Number,
    required: true
  }
})

// Check if there is any data
const hasData = computed(() => props.pendingCount > 0 || props.resolvedCount > 0)

// Chart data as computed property to make it reactive
const chartData = computed(() => {
  return {
    labels: ['Pending', 'Resolved'],
    datasets: [{
      backgroundColor: ['#F59E0B', '#10B981'],
      hoverBackgroundColor: ['#D97706', '#059669'],
      borderWidth: 0,
      data: [props.pendingCount, props.resolvedCount]
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
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
    <p class="text-gray-500 text-sm">No report data available</p>
  </div>
</template>
