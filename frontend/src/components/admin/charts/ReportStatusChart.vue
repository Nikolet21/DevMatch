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
    required: true
  },
  resolvedCount: {
    type: Number,
    required: true
  }
})

// Chart data as computed property to make it reactive
const chartData = computed(() => {
  return {
    labels: ['Pending', 'Investigating', 'Resolved'],
    datasets: [{
      backgroundColor: ['#F59E0B', '#3B82F6', '#10B981'],
      hoverBackgroundColor: ['#D97706', '#2563EB', '#059669'],
      data: [props.pendingCount, props.investigatingCount, props.resolvedCount]
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
