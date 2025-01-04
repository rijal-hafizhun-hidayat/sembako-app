<script setup lang="ts">
import api from '@/plugins/api'
import type { AxiosError, AxiosResponse } from 'axios'
import { onMounted, ref, type Ref } from 'vue'

interface Fetch {
  statusCode: number
  message: string
  data: CountTransaction
}
interface CountTransaction {
  count_transaction: number
}

const countTransaction: Ref<number> = ref(0)

onMounted(async () => {
  try {
    const result: AxiosResponse<Fetch> = await api.get('dashboard/today-count-transaction')
    countTransaction.value = result.data.data.count_transaction
  } catch (error) {
    const err = error as AxiosError
    console.log(err)
  }
})
</script>
<template>
  <div class="bg-white mt-10 px-4 py-6 rounded shadow-md overflow-x-auto flex justify-start">
    <div class="space-y-2">
      <h1>Today's Transaction</h1>
      <p class="font-semibold text-2xl">{{ countTransaction }}</p>
    </div>
  </div>
</template>
