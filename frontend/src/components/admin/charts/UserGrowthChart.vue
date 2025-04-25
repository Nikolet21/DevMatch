<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import type { AdminUser } from '@/stores/adminUserStore'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const props = defineProps({
  users: {
    type: Array as () => AdminUser[],
    required: true
  }
})

// User activity timeline (registrations by date)
const chartData = computed(() => {
  // Group by month for readability
  const months: Record<string, number> = {}

  props.users.forEach(user => {
    const month = user.joinDate.toLocaleString('default', { month: 'short' })
    months[month] = (months[month] || 0) + 1
  })

  const sortedMonths = Object.keys(months).sort((a, b) => {
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return monthOrder.indexOf(a) - monthOrder.indexOf(b)
  })

  return {
    labels: sortedMonths,
    datasets: [{
      label: 'New Users',
      backgroundColor: 'rgba(92, 106, 196, 0.2)',
      borderColor: '#5C6AC4',
      borderWidth: 2,
      pointBackgroundColor: '#5C6AC4',
      tension: 0.4,
      data: sortedMonths.map(month => months[month])
    }]
  }
})

// Chart.js options
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const
    },
    title: {
      display: true,
      text: 'User Growth Timeline'
    }
  }
}
</script>

<template>
  <div class="h-64">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
