<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import type { AdminUser } from '@/stores/adminUserStore'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  users: {
    type: Array as () => AdminUser[],
    required: true
  }
})

// User statistics
const chartData = computed(() => {
  const roleData = {
    admin: 0,
    user: 0,
    developer: 0
  }

  props.users.forEach(user => {
    if (user.role in roleData) {
      roleData[user.role as keyof typeof roleData]++
    }
  })

  return {
    labels: Object.keys(roleData).map(role => role.charAt(0).toUpperCase() + role.slice(1)),
    datasets: [{
      backgroundColor: ['#5C6AC4', '#9C6ADE', '#10B981'],
      hoverBackgroundColor: ['#4C59B4', '#8C5ACE', '#00A871'],
      data: Object.values(roleData)
    }]
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
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>
