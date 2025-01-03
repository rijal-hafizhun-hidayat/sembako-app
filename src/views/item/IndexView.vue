<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import PrimaryButton from '@/components/base/PrimaryButton.vue'
import DangerButton from '@/components/base/DangerButton.vue'
import TextInput from '@/components/base/TextInput.vue'
import { computed, onMounted, ref, type Ref } from 'vue'
import type { AxiosError, AxiosResponse } from 'axios'
import api from '@/plugins/api'
import { Timestamp } from '@/utils/timestamp'
import { useRouter } from 'vue-router'
import { SweetAlert } from '@/utils/sweetalert'

interface Fetch {
  statusCode: number
  message: string
  data: Item[]
}
interface Item {
  id: number
  name: string
  price: number
  description: string
  created_at: Date
  updated_at: Date
}

const items: Ref<Item[]> = ref([])
const search: Ref<string> = ref('')
const isLoading: Ref<boolean> = ref(false)
const isLoadingButton: Ref<boolean> = ref(false)
const router = useRouter()

onMounted(async () => {
  try {
    isLoading.value = true
    const result: AxiosResponse<Fetch> = await api.get('item')
    items.value = result.data.data as Item[]
  } catch (error) {
    const err = error as AxiosError
    console.log(err)
  } finally {
    isLoading.value = false
  }
})

const toItemCreateView = () => {
  router.push({
    name: 'item.create',
  })
}

const toItemShowView = (itemId: number) => {
  router.push({
    name: 'item.show',
    params: {
      itemId: itemId,
    },
  })
}

const toDeleteItemByItemId = async (itemId: number) => {
  try {
    const result: AxiosResponse<Fetch> = await api.delete(`item/${itemId}`)
    SweetAlert.successAlert(result.data.message)
    items.value = items.value.filter((item) => item.id !== itemId)
  } catch (error) {
    const err = error as AxiosError
    console.log(err)
  }
}

const searchItemByName = computed(() => {
  const query = search.value.toLowerCase()
  return items.value.filter((item) => item.name.toLowerCase().includes(query))
})
</script>
<template>
  <DashboardLayout>
    <template #header>
      <div class="flex justify-between">
        <div>
          <h2 class="font-semibold text-xl text-gray-800 leading-tight">Item</h2>
        </div>
        <div>
          <PrimaryButton @click="toItemCreateView()">Add Item</PrimaryButton>
        </div>
      </div>
    </template>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white mt-10 px-4 py-6 rounded shadow-md overflow-x-auto">
        <div class="grid grid-rows-1 sm:grid-cols-2 gap-3">
          <div>
            <TextInput v-model="search" placeholder="find category by name" class="block w-full" />
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white mt-10 px-4 py-6 rounded shadow-md overflow-x-auto">
        <table class="w-full whitespace-nowrap">
          <thead>
            <tr class="text-left font-bold">
              <th class="pb-4 pt-6 px-6">#</th>
              <th class="pb-4 pt-6 px-6">Name</th>
              <th class="pb-4 pt-6 px-6">Description</th>
              <th class="pb-4 pt-6 px-6">Created At</th>
              <th class="pb-4 pt-6 px-6">Updated At</th>
              <th class="pb-4 pt-6 px-6">Action</th>
            </tr>
          </thead>
          <tbody v-if="items.length > 0">
            <tr v-for="(item, index) in searchItemByName" :key="item.id" class="hover:bg-gray-100">
              <td class="border-t items-center px-6 py-4">
                {{ index + 1 }}
              </td>
              <td class="border-t items-center px-6 py-4">
                {{ item.name }}
              </td>
              <td class="border-t items-center px-6 py-4">
                {{ item.description }}
              </td>
              <td class="border-t items-center px-6 py-4">
                {{ Timestamp.formatTimestamp(item.created_at) }}
              </td>
              <td class="border-t items-center px-6 py-4">
                {{ Timestamp.formatTimestamp(item.updated_at) }}
              </td>
              <td class="border-t items-center px-6 py-4 flex justify-start space-x-4">
                <div>
                  <PrimaryButton
                    @click="toItemShowView(item.id)"
                    :disabled="isLoadingButton"
                    type="button"
                    >Update</PrimaryButton
                  >
                </div>
                <div>
                  <DangerButton
                    @click="toDeleteItemByItemId(item.id)"
                    :disabled="isLoadingButton"
                    type="button"
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
