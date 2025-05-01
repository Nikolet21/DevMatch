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
        data
      }
    ]
  }
})

// Chart.js options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}
</script>

<template>
  <div class="h-64">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
