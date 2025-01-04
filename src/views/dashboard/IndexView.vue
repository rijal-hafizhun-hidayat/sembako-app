<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import TodaySale from '@/components/dashboard/TodaySale.vue'
import TodayTransaction from '@/components/dashboard/TodayTransaction.vue'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

const authStore = useAuthStore()
const options = ref({
  chart: {
    type: 'bar',
    heigh: 350,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      borderRadius: 5,
      borderRadiusApplicaction: 'end',
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparant'],
  },
  xaxis: {
    categories: [
      'January',
      'February',
      'March',
      'April',
      'Mei',
      'Jun',
      'Jul',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec',
    ],
  },
  yaxis: {
    title: {
      text: '$ (thousands)',
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: function (val: number) {
        return '$ ' + val + ' thousands'
      },
    },
  },
})
const series = ref([
  {
    name: 'Net Profit',
    data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 80, 76, 54],
  },
  {
    name: 'Revenue',
    data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 90, 65, 32],
  },
  {
    name: 'Free Cash Flow',
    data: [35, 41, 36, 26, 45, 48, 52, 53, 41, 69, 34, 11],
  },
])
</script>
<template>
  <DashboardLayout>
    <template #header>
      <div class="flex justify-between">
        <div>
          <h2 class="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>
        </div>
      </div>
    </template>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white mt-10 px-4 py-6 rounded shadow-md overflow-x-auto">
        <p>welcome {{ authStore.auth?.name }}</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-rows-1 sm:grid-cols-2 sm:gap-4">
      <TodaySale />
      <TodayTransaction />
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white mt-10 px-4 py-6 rounded shadow-md overflow-x-auto">
        <apexchart type="bar" :options="options" :series="series"></apexchart>
      </div>
    </div>
  </DashboardLayout>
</template>
