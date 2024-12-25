<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import InputLabel from '@/components/base/InputLabel.vue'
import TextInput from '@/components/base/TextInput.vue'
import PrimaryButton from '@/components/base/PrimaryButton.vue'
import Multiselect from 'vue-multiselect'
import { onMounted, reactive, ref, type Ref } from 'vue'
import type { AxiosError, AxiosResponse } from 'axios'
import api from '@/plugins/api'

interface Form {
  name: string
  items: Item[]
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

const items: Ref<Item[]> = ref([])
const isLoadingMultiselect: Ref<boolean> = ref(false)
const isLoading: Ref<boolean> = ref(false)
const form: Form = reactive({
  name: '',
  items: [],
})

onMounted(async () => {
  try {
    isLoadingMultiselect.value = true
    const result: AxiosResponse<Fetch> = await api.get('item')
    items.value = result.data.data as Item[]
    console.log(items.value)
  } catch (error) {
    const err = error as AxiosError
    console.log(err)
  } finally {
    isLoadingMultiselect.value = false
  }
})

const send = () => {
  console.log(form)
}
</script>
<template>
  <DashboardLayout>
    <template #header>
      <div class="flex justify-between">
        <div>
          <h2 class="font-semibold text-xl text-gray-800 leading-tight">Add Item</h2>
        </div>
      </div>
    </template>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white mt-10 px-4 py-6 rounded shadow-md overflow-x-auto">
        <form @submit.prevent="send()" class="space-y-4">
          <div>
            <InputLabel>name</InputLabel>
            <TextInput class="block w-full mt-1" v-model="form.name" />
          </div>
          <div>
            <InputLabel>Item</InputLabel>
            <Multiselect
              :close-on-select="false"
              :clear-on-select="false"
              :disabled="isLoadingMultiselect"
              class="block mt-1 w-full"
              v-model="form.items"
              tag-placeholder="Add this as new tag"
              placeholder="Search or add a tag"
              label="name"
              track-by="id"
              :options="items"
              :multiple="false"
              :taggable="true"
            ></Multiselect>
          </div>
          <div>
            <PrimaryButton :disabled="isLoading" type="submit">submit</PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  </DashboardLayout>
</template>
