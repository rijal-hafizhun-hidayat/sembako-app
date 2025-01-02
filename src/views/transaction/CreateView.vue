<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import InputLabel from '@/components/base/InputLabel.vue'
import TextInput from '@/components/base/TextInput.vue'
import PrimaryButton from '@/components/base/PrimaryButton.vue'
import DangerButton from '@/components/base/DangerButton.vue'
import Multiselect from 'vue-multiselect'
import { onMounted, reactive, ref, computed, type Ref } from 'vue'
import type { AxiosError, AxiosResponse } from 'axios'
import api from '@/plugins/api'
import { Number } from '@/utils/number'

interface Form {
  item: Item | null
  total_price: number
  qty: number
}
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
interface LabelProps {
  name: string
  description: string | null
  price: number
}

const isLoading: Ref<boolean> = ref(false)
const batchItemQuantities = ref<{ [key: number]: number }>({})
const isLoadingMultiselect: Ref<boolean> = ref(false)
const items: Ref<Item[]> = ref([])
const batchItems: Ref<Item[]> = ref([])
const form: Form = reactive({
  item: null,
  total_price: 0,
  qty: 0,
})

onMounted(async () => {
  try {
    const result: AxiosResponse<Fetch> = await api.get('item')
    items.value = result.data.data as Item[]
  } catch (error) {
    const err = error as AxiosError
    console.log(err)
  }
})

const customLabel = ({ name, description, price }: LabelProps) => {
  const formatPrice = Number.formatRupiah(price)
  return `${name} – ${description} - ${formatPrice}`
}

const pushBatchTransaction = (item: Item | null) => {
  if (item != null) {
    batchItems.value.push(item)
  }
}

const destroyBatchItemsByItemId = (value: Item) => {
  batchItems.value = batchItems.value.filter((batchItem) => batchItem.id !== value.id)
  form.total_price -= value.price
}

const itemTotalPrice = computed(() => {
  return batchItems.value.map((item) => {
    const quantity = batchItemQuantities.value[item.id] || 1
    return {
      ...item,
      total: item.price * quantity,
    }
  })
})

const totalPrice = computed(() => {
  return batchItems.value.reduce((total, item) => {
    return total + item.price * (batchItemQuantities.value[item.id] || 1)
  }, 0)
})
</script>
<template>
  <DashboardLayout>
    <template #header>
      <div class="flex justify-between">
        <div>
          <h2 class="font-semibold text-xl text-gray-800 leading-tight">Add Transaction</h2>
        </div>
      </div>
    </template>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white mt-10 px-4 py-6 rounded shadow-md">
        <form class="space-y-4">
          <div>
            <InputLabel>item</InputLabel>
            <Multiselect
              @select="pushBatchTransaction(form.item)"
              :close-on-select="true"
              :clear-on-select="true"
              :disabled="isLoadingMultiselect"
              class="block mt-1 w-full"
              v-model="form.item"
              tag-placeholder="Add this as new tag"
              placeholder="Search or add a tag"
              label="name"
              track-by="id"
              :custom-label="customLabel"
              :options="items"
              :multiple="false"
              :taggable="false"
            ></Multiselect>
          </div>
          <div>
            <table class="w-full whitespace-nowrap">
              <thead>
                <tr class="text-left font-bold">
                  <th class="pb-4 pt-6 px-6">#</th>
                  <th class="pb-4 pt-6 px-6">ID Item</th>
                  <th class="pb-4 pt-6 px-6">Name</th>
                  <th class="pb-4 pt-6 px-6">Qty</th>
                  <th class="pb-4 pt-6 px-6">Price/item</th>
                  <th class="pb-4 pt-6 px-6">Total Price</th>
                  <th class="pb-4 pt-6 px-6">Action</th>
                </tr>
              </thead>
              <tbody v-for="(batchItem, index) in batchItems" :key="batchItem.id">
                <tr class="hover:bg-gray-100">
                  <td class="border-t items-center px-6 py-4">{{ index + 1 }}</td>
                  <td class="border-t items-center px-6 py-4">{{ batchItem.id }}</td>
                  <td class="border-t items-center px-6 py-4">{{ batchItem.name }}</td>
                  <td class="border-t items-center px-6 py-4">
                    <TextInput
                      type="number"
                      v-model="batchItemQuantities[batchItem.id]"
                      class="block"
                    />
                  </td>
                  <td class="border-t items-center px-6 py-4">
                    {{ Number.formatRupiah(batchItem.price) }}
                  </td>
                  <td class="border-t items-center px-6 py-4">
                    {{ Number.formatRupiah(itemTotalPrice[index].total) }}
                  </td>
                  <td class="border-t items-center px-6 py-4 flex justify-start space-x-4">
                    <div>
                      <DangerButton @click="destroyBatchItemsByItemId(batchItem)" type="button"
                        >Delete</DangerButton
                      >
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <InputLabel>Total Price All Item</InputLabel>
            <input
              type="text"
              :value="Number.formatRupiah(totalPrice)"
              class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm block w-full"
            />
            <TextInput v-model="totalPrice" :hidden="true" :disable="true" />
          </div>
          <div>
            <PrimaryButton :disabled="isLoading" type="submit">submit</PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  </DashboardLayout>
</template>
