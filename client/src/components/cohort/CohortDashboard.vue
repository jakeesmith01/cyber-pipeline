<script setup>
import Chart from 'primevue/chart'
import Panel from 'primevue/panel'

import { ref, onMounted } from 'vue'
onMounted(() => {
  chartData.value = setChartData()
  chartOptions.value = setChartOptions()
})

const chartData = ref()
const chartOptions = ref()

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement)

  return {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        type: 'bar',
        label: 'Dataset 1',
        backgroundColor: documentStyle.getPropertyValue('--cyan-500'),
        data: [50, 25, 12, 48, 90, 76, 42]
      },
      {
        type: 'bar',
        label: 'Dataset 2',
        backgroundColor: documentStyle.getPropertyValue('--gray-500'),
        data: [21, 84, 24, 75, 37, 65, 34]
      },
      {
        type: 'bar',
        label: 'Dataset 3',
        backgroundColor: documentStyle.getPropertyValue('--orange-500'),
        data: [41, 52, 24, 74, 23, 21, 32]
      }
    ]
  }
}
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--text-color')
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary')
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border')

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      tooltips: {
        mode: 'index',
        intersect: false
      },
      legend: {
        labels: {
          color: textColor
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder
        }
      },
      y: {
        stacked: true,
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder
        }
      }
    }
  }
}
</script>

<template>
  <Panel header="Cohort Dashboard">
    <Chart
      type="bar"
      :data="chartData"
      :options="chartOptions"
      class="h-[30rem]"
    />
  </Panel>
</template>

<style scoped>
.p-panel {
  margin-bottom: 0.5rem;
}
</style>