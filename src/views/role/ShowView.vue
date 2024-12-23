<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import InputLabel from '@/components/base/InputLabel.vue'
import TextInput from '@/components/base/TextInput.vue'
import PrimaryButton from '@/components/base/PrimaryButton.vue'
import InputError from '@/components/base/InputError.vue'
import { onMounted, reactive, ref, type Ref } from 'vue'
import type { AxiosError, AxiosResponse } from 'axios'
import api from '@/plugins/api'
import { useRoute, useRouter } from 'vue-router'
import { FormatErrors } from '@/utils/format-error'
import { SweetAlert } from '@/utils/sweetalert'

interface Form {
  name: string
}
interface Fetch {
  statusCode: number
  message: string
  data: Role
}
interface Role {
  id: number
  name: string
  created_at: Date
  updated_at: Date
}
interface Validation {
  statusCode: number
  errors: Record<string, string[]>
}

const route = useRoute()
const router = useRouter()
const isLoading: Ref<boolean> = ref(false)
const validation: Ref<Validation | null> = ref(null)
const form: Form = reactive({
  name: '',
})

onMounted(async () => {
  try {
    isLoading.value = true
    const result: AxiosResponse<Fetch> = await api.get(`role/${route.params.roleId}`)
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
    const result: AxiosResponse<Fetch> = await api.put(`role/${route.params.roleId}`, {
      name: form.name,
    })
    SweetAlert.successAlert(result.data.message)
    router.push({
      name: 'role.index',
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
  }
}
</script>
<template>
  <DashboardLayout>
    <template #header>
      <div class="flex justify-between">
        <div>
          <h2 class="font-semibold text-xl text-gray-800 leading-tight">Show Role</h2>
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
            <PrimaryButton :disabled="isLoading" type="submit">submit</PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  </DashboardLayout>
</template>
