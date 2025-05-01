<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import type { User } from '@/interfaces/interfaces'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps({
  users: {
    type: Array as () => User[],
    required: true
  }
})

// Check if we have any skills data
const hasData = computed(() => {
  if (!props.users.length) return false
  
  // Check if at least one user has skills
  return props.users.some(user => user.skills && Array.isArray(user.skills) && user.skills.length > 0)
})

// Analyze skills distribution
const chartData = computed(() => {
  // Count all skills
  const skillsCount: Record<string, number> = {}

  props.users.forEach(user => {
    if (user.skills && Array.isArray(user.skills)) {
      user.skills.forEach((skill: string) => {
        skillsCount[skill] = (skillsCount[skill] || 0) + 1
      })
    }
  })

  // Sort by count, get top skills
  const topSkills = Object.entries(skillsCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return {
    labels: topSkills.map(([skill]) => skill),
    datasets: [
      {
        label: 'Developer Skills',
        backgroundColor: '#10B981',
        borderRadius: 6,
        data: topSkills.map(([, count]) => count)
      }
    ]
  }
})

// Chart.js options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
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
      grid: {
        display: false
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
    <Bar :data="chartData" :options="chartOptions" />
  </div>
  <div v-else class="h-64 flex flex-col items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
    <p class="text-gray-500 text-sm">No skills data available</p>
  </div>
</template>
