<script setup lang="ts">
import api from '@/plugins/api'
import { Number } from '@/utils/number'
import type { AxiosError, AxiosResponse } from 'axios'
import { onMounted, ref, type Ref } from 'vue'

interface Fetch {
  statusCode: number
  message: string
  data: TotalPrice
}
interface TotalPrice {
  total_price: number
}

const totalPrice: Ref<number> = ref(0)

onMounted(async () => {
  try {
    const result: AxiosResponse<Fetch> = await api.get('dashboard/today-sales')
    console.log(result)
    totalPrice.value = result.data.data.total_price
  } catch (error) {
    const err = error as AxiosError
    console.log(err)
  }
})
</script>
<template>
  <div class="bg-white mt-10 px-4 py-6 rounded shadow-md overflow-x-auto flex justify-start">
    <div class="space-y-2">
      <h1>Today's sales</h1>
      <p class="font-semibold text-2xl">{{ Number.formatRupiah(totalPrice) }}</p>
    </div>
  </div>
</template>
