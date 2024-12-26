<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import InputLabel from '@/components/base/InputLabel.vue'
import TextInput from '@/components/base/TextInput.vue'
import PrimaryButton from '@/components/base/PrimaryButton.vue'
import TextArea from '@/components/base/TextArea.vue'
import Multiselect from 'vue-multiselect'
import { onMounted, reactive, ref, type Ref } from 'vue'
import type { AxiosError, AxiosResponse } from 'axios'
import api from '@/plugins/api'
import { String } from '@/utils/string'
import { SweetAlert } from '@/utils/sweetalert'
import { useRouter } from 'vue-router'
import { FormatErrors } from '@/utils/format-error'

interface Form {
  name: string
  price: string
  description: string
  category: Category | null
}
interface Fetch {
  statusCode: number
  message: string
  data: Category[] | Item
}
interface Category {
  created_at: Date
  id: number
  name: string
  updated_at: Date
}
interface Item {
  created_at: Date
  description: string | null
  id: number
  updated_at: Date
  price: number
}
interface Validation {
  statusCode: number
  errors: Record<string, string[]>
}

const router = useRouter()
const validation: Ref<Validation | null> = ref(null)
const categories: Ref<Category[]> = ref([])
const isLoadingMultiselect: Ref<boolean> = ref(false)
const isLoading: Ref<boolean> = ref(false)
const form: Form = reactive({
  name: '',
  price: '',
  description: '',
  category: null,
})

onMounted(async () => {
  try {
    isLoadingMultiselect.value = true
    const result: AxiosResponse<Fetch> = await api.get('category')
    categories.value = result.data.data as Category[]
    console.log(categories.value)
  } catch (error) {
    const err = error as AxiosError
    console.log(err)
  } finally {
    isLoadingMultiselect.value = false
  }
})

const send = async () => {
  try {
    isLoading.value = true
    const result: AxiosResponse<Fetch> = await api.post('item', {
      name: form.name,
      price: parseInt(form.price),
      description: String.isEmptyString(form.description),
      category: form.category,
    })
    SweetAlert.successAlert(result.data.message)
    router.push({
      name: 'item.index',
    })
  } catch (error) {
    const err = error as AxiosError
    if (err.response?.status === 400) {
      validation.value = err.response.data as Validation
    } else if (err.response?.status === 404) {
      validation.value = err.response.data as Validation
      const errors = FormatErrors.formatErrorMessage(validation.value.errors)
      SweetAlert.errorAlert(errors)
    }
  } finally {
    isLoading.value = false
  }
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
            <InputLabel>price</InputLabel>
            <TextInput type="number" class="block w-full mt-1" v-model="form.price" />
          </div>
          <div>
            <InputLabel>description</InputLabel>
            <TextArea class="block w-full mt-1" rows="8" v-model="form.description"></TextArea>
          </div>
          <div>
            <InputLabel>Item</InputLabel>
            <Multiselect
              :close-on-select="true"
              :clear-on-select="true"
              :disabled="isLoadingMultiselect"
              class="block mt-1 w-full"
              v-model="form.category"
              tag-placeholder="Add this as new tag"
              placeholder="Search or add a tag"
              label="name"
              track-by="id"
              :options="categories"
              :multiple="false"
              :taggable="false"
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
