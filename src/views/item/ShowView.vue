<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import TextInput from '@/components/base/TextInput.vue'
import InputLabel from '@/components/base/InputLabel.vue'
import PrimaryButton from '@/components/base/PrimaryButton.vue'
import InputError from '@/components/base/InputError.vue'
import TextArea from '@/components/base/TextArea.vue'
import Multiselect from 'vue-multiselect'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, reactive, ref, type Ref } from 'vue'
import type { AxiosError, AxiosResponse } from 'axios'
import api from '@/plugins/api'
import { String } from '@/utils/string'
import { SweetAlert } from '@/utils/sweetalert'
import { FormatErrors } from '@/utils/format-error'

interface Validation {
  statusCode: number
  errors: Record<string, string[]>
}
interface Fetch {
  statusCode: number
  message: string
  data: Item | Category[]
}
interface Item {
  created_at: Date
  description: string | null
  id: number
  updated_at: Date
  price: number
  name: string
  category_item: CategoryItem | null
}
interface CategoryItem {
  id: number
  item_id: number
  category_id: number
  created_at: Date
  updated_at: Date
  category: Category
}
interface Category {
  created_at: Date
  id: number
  name: string
  updated_at: Date
}
interface Form {
  name: string
  price: number
  description: string
  category: Category | null
}

const route = useRoute()
const router = useRouter()
const categories: Ref<Category[]> = ref([])
const isLoading: Ref<boolean> = ref(false)
const isLoadingMultiselect: Ref<boolean> = ref(false)
const validation: Ref<Validation | null> = ref(null)
const form: Form = reactive({
  name: '',
  price: 0,
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
    const errCategories = error as AxiosError
    console.log(errCategories)
  } finally {
    isLoadingMultiselect.value = false
  }

  try {
    const result: AxiosResponse<Fetch> = await api.get(`item/${route.params.itemId}`)
    const item = result.data.data as Item
    form.name = item.name
    form.price = item.price
    form.description = item.description as string
    form.category = item.category_item?.category as Category
  } catch (error) {
    const errItem = error as AxiosError
    console.log(errItem)
  }
})

const send = async () => {
  try {
    isLoading.value = true
    const result: AxiosResponse<Fetch> = await api.put(`item/${route.params.itemId}`, {
      name: form.name,
      price: form.price,
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
          <h2 class="font-semibold text-xl text-gray-800 leading-tight">Show Item</h2>
        </div>
      </div>
    </template>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white mt-10 px-4 py-6 rounded shadow-md overflow-x-auto">
        <form @submit.prevent="send()" class="space-y-4">
          <div>
            <InputLabel>name</InputLabel>
            <TextInput class="block w-full mt-1" v-model="form.name" />
            <InputError
              v-if="validation && validation.statusCode === 400 && validation.errors.name"
              :message="validation.errors.name[0]"
            />
          </div>
          <div>
            <InputLabel>price</InputLabel>
            <TextInput type="number" class="block w-full mt-1" v-model="form.price" />
            <InputError
              v-if="validation && validation.statusCode === 400 && validation.errors.price"
              :message="validation.errors.price[0]"
            />
          </div>
          <div>
            <InputLabel>description</InputLabel>
            <TextArea class="block w-full mt-1" rows="8" v-model="form.description"></TextArea>
            <InputError
              v-if="validation && validation.statusCode === 400 && validation.errors.description"
              :message="validation.errors.description[0]"
            />
          </div>
          <div>
            <InputLabel>Category</InputLabel>
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
            <InputError
              v-if="validation && validation.statusCode === 400 && validation.errors.category"
              :message="validation.errors.category[0]"
            />
          </div>
          <div>
            <PrimaryButton :disabled="isLoading" type="submit">submit</PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  </DashboardLayout>
</template>
