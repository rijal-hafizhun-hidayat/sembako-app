<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import PrimaryButton from '@/components/base/PrimaryButton.vue'
import DangerButton from '@/components/base/DangerButton.vue'
import { useRouter } from 'vue-router'
import { onMounted, ref, type Ref } from 'vue'
import type { AxiosError, AxiosResponse } from 'axios'
import api from '@/plugins/api'
import { SweetAlert } from '@/utils/sweetalert'
import { Timestamp } from '@/utils/timestamp'

interface Fetch {
  statucCode: number
  message: string
  data: Transaction[]
}
interface Transaction {
  id: number
  total_price: number
  created_at: Date
  updated_at: Date
}

const router = useRouter()
const isLoading: Ref<boolean> = ref(false)
const transactions: Ref<Transaction[]> = ref([])

const toTransactionCreateView = () => {
  router.push({
    name: 'transaction.create',
  })
}

onMounted(async () => {
  try {
    isLoading.value = true
    const result: AxiosResponse<Fetch> = await api.get('transaction')
    transactions.value = result.data.data as Transaction[]
  } catch (error) {
    const err = error as AxiosError
    console.log(err)
  } finally {
    isLoading.value = false
  }
})

const destroyTransactionByTransactionId = async (transactionId: number) => {
  try {
    const result: AxiosResponse<Fetch> = await api.delete(`transaction/${transactionId}`)
    SweetAlert.successAlert(result.data.message)
    transactions.value = transactions.value.filter(
      (transaction) => transaction.id !== transactionId,
    )
  } catch (error) {
    const err = error as AxiosError
    console.log(err)
  }
}

const toDetailTransactionView = (transactionId: number) => {
  router.push({
    name: 'transaction.detail',
    params: {
      transactionId: transactionId,
    },
  })
}
</script>
<template>
  <DashboardLayout>
    <template #header>
      <div class="flex justify-between">
        <div>
          <h2 class="font-semibold text-xl text-gray-800 leading-tight">Transaction</h2>
        </div>
        <div>
          <PrimaryButton @click="toTransactionCreateView()">Add Transaction</PrimaryButton>
        </div>
      </div>
    </template>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white mt-10 px-4 py-6 rounded shadow-md overflow-x-auto">
        <table class="w-full whitespace-nowrap">
          <thead>
            <tr class="text-left font-bold">
              <th class="pb-4 pt-6 px-6">#</th>
              <th class="pb-4 pt-6 px-6">ID Transaction</th>
              <th class="pb-4 pt-6 px-6">Total</th>
              <th class="pb-4 pt-6 px-6">Created At</th>
              <th class="pb-4 pt-6 px-6">Updated At</th>
              <th class="pb-4 pt-6 px-6">Action</th>
            </tr>
          </thead>
          <tbody v-if="transactions.length > 0">
            <tr
              v-for="(transaction, index) in transactions"
              :key="transaction.id"
              class="hover:bg-gray-100"
            >
              <td class="border-t items-center px-6 py-4">
                {{ index + 1 }}
              </td>
              <td class="border-t items-center px-6 py-4">{{ transaction.id }}</td>
              <td class="border-t items-center px-6 py-4">{{ transaction.total_price }}</td>
              <td class="border-t items-center px-6 py-4">
                {{ Timestamp.formatTimestamp(transaction.created_at) }}
              </td>
              <td class="border-t items-center px-6 py-4">
                {{ Timestamp.formatTimestamp(transaction.updated_at) }}
              </td>
              <td class="border-t items-center px-6 py-4 flex justify-start space-x-4">
                <div>
                  <PrimaryButton @click="toDetailTransactionView(transaction.id)" type="button"
                    >Detail Items</PrimaryButton
                  >
                </div>
                <div>
                  <DangerButton
                    type="button"
                    @click="destroyTransactionByTransactionId(transaction.id)"
                    >Delete</DangerButton
                  >
                </div>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr class="hover:bg-gray-100">
              <td class="border-t items-center px-6 py-4 text-center" colspan="5">
                <span v-if="isLoading === true">loading ...</span>
                <span v-else>data not found</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </DashboardLayout>
</template>
