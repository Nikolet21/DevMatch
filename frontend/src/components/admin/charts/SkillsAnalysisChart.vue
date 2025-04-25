<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import type { AdminUser } from '@/stores/adminUserStore'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps({
  users: {
    type: Array as () => AdminUser[],
    required: true
  }
})

// Most common skills among developers
const chartData = computed(() => {
  const skillCounts: Record<string, number> = {}

  props.users.forEach(user => {
    user.skills.forEach((skill: string) => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1
    })
  })

  // Get top skills
  const topSkills = Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return {
    labels: topSkills.map(([skill]) => skill),
    datasets: [{
      label: 'Developers with Skill',
      backgroundColor: '#9C6ADE',
      data: topSkills.map(([, count]) => count)
    }]
  }
})

// Chart.js options
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: true,
      text: 'Most Popular Skills'
    }
  }
}
</script>

<template>
  <div class="h-64">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
