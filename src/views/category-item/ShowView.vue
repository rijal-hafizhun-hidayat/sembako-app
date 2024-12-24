<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import InputLabel from '@/components/base/InputLabel.vue'
import TextInput from '@/components/base/TextInput.vue'
import PrimaryButton from '@/components/base/PrimaryButton.vue'
import { onMounted, reactive, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import type { AxiosError, AxiosResponse } from 'axios'
import api from '@/plugins/api'
import { SweetAlert } from '@/utils/sweetalert'
import router from '@/router'
import { FormatErrors } from '@/utils/format-error'

interface Form {
  name: string
}
interface Fetch {
  statusCode: number
  message: string
  data: CategoryItem
}
interface CategoryItem {
  created_at: Date
  id: number
  name: string
  updated_at: Date
}
interface Validation {
  statusCode: number
  errors: Record<string, string[]>
}

const validation: Ref<Validation | null> = ref(null)
const route = useRoute()
const isLoading: Ref<boolean> = ref(false)
const form: Form = reactive({
  name: '',
})

onMounted(async () => {
  try {
    isLoading.value = true
    const result: AxiosResponse<Fetch> = await api.get(
      `category-item/${route.params.categoryItemId}`,
    )
    form.name = result.data.data.name
  } catch (error) {
    const err = error as AxiosError
    console.log(err)
  } finally {
    isLoading.value = false
  }
})
const send = async () => {
  try {
    isLoading.value = true
    const result: AxiosResponse<Fetch> = await api.put(
      `category-item/${route.params.categoryItemId}`,
      {
        name: form.name,
      },
    )
    SweetAlert.successAlert(result.data.message)
    router.push({
      name: 'category-item.index',
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
          <h2 class="font-semibold text-xl text-gray-800 leading-tight">Show Category Item</h2>
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
            <PrimaryButton :disabled="isLoading" type="submit">submit</PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  </DashboardLayout>
</template>
