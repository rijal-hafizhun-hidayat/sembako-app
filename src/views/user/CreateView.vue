<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import InputLabel from '@/components/base/InputLabel.vue'
import TextInput from '@/components/base/TextInput.vue'
import PrimaryButton from '@/components/base/PrimaryButton.vue'
import InputError from '@/components/base/InputError.vue'
import Multiselect from 'vue-multiselect'
import { onMounted, reactive, ref, type Ref } from 'vue'
import type { AxiosError, AxiosResponse } from 'axios'
import api from '@/plugins/api'
import { FormatErrors } from '@/utils/format-error'
import { SweetAlert } from '@/utils/sweetalert'
import { useRouter } from 'vue-router'

interface Fetch {
  statusCode: number
  message: string
  data: Role[] | UserWithUserRoleAndRole
}
interface Validation {
  statusCode: number
  errors: Record<string, string[]>
}
interface Form {
  name: string
  email: string
  password: string
  role: Role | null
}
interface Role {
  id: number
  name: string
  created_at: Date
  updated_at: Date
}
interface UserWithUserRoleAndRole {
  id: number
  name: string
  email: string
  created_at: Date
  updated_at: Date
  user_role: UserRoleWithRole
}
interface UserRoleWithRole {
  id: number
  user_id: number
  role_id: number
  created_at: Date
  updated_at: Date
  role: Role
}

const router = useRouter()
const validation: Ref<Validation | null> = ref(null)
const roles: Ref<Role[]> = ref([])
const isLoadingRoles: Ref<boolean> = ref(false)
const isLoading: Ref<boolean> = ref(false)
const form: Form = reactive({
  name: '',
  email: '',
  password: '',
  role: null,
})

onMounted(async () => {
  try {
    isLoadingRoles.value = true
    const result: AxiosResponse<Fetch> = await api.get('role')
    roles.value = result.data.data as Role[]
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
    isLoadingRoles.value = false
  }
})

const send = async () => {
  try {
    isLoading.value = true
    const result: AxiosResponse<Fetch> = await api.post('user', {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
    })

    console.log(result)
    SweetAlert.successAlert(result.data.message)
    router.push({
      name: 'user.index',
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
          <h2 class="font-semibold text-xl text-gray-800 leading-tight">Add User</h2>
        </div>
      </div>
    </template>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white mt-10 px-4 py-6 rounded shadow-md overflow-x-auto">
        <form @submit.prevent="send()" class="space-y-4">
          <div>
            <InputLabel>name</InputLabel>
            <TextInput type="text" class="block w-full mt-1" v-model="form.name" />
            <InputError
              v-if="validation && validation.statusCode === 400 && validation.errors.name"
              :message="validation.errors.name[0]"
            />
          </div>
          <div>
            <InputLabel>email</InputLabel>
            <TextInput type="email" class="block w-full mt-1" v-model="form.email" />
            <InputError
              v-if="validation && validation.statusCode === 400 && validation.errors.email"
              :message="validation.errors.email[0]"
            />
          </div>
          <div>
            <InputLabel>Role</InputLabel>
            <Multiselect
              :close-on-select="true"
              :clear-on-select="true"
              :disabled="isLoadingRoles"
              class="block mt-1 w-full"
              v-model="form.role"
              tag-placeholder="Add this as new tag"
              placeholder="Search or add a tag"
              label="name"
              track-by="id"
              :options="roles"
              :multiple="false"
              :taggable="false"
            ></Multiselect>
            <InputError
              v-if="validation && validation.statusCode === 400 && validation.errors.role"
              :message="validation.errors.role[0]"
            />
          </div>
          <div>
            <InputLabel>password</InputLabel>
            <TextInput type="password" class="block w-full mt-1" v-model="form.password" />
            <InputError
              v-if="validation && validation.statusCode === 400 && validation.errors.password"
              :message="validation.errors.password[0]"
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
