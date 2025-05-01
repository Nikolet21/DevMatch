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
        data: topSkills.map(([, count]) => count)
      }
    ]
  }
})

// Chart.js options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const
}
</script>

<template>
  <div class="h-64">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
