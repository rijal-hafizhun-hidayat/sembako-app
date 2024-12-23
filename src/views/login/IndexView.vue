<script setup lang="ts">
import GuestLayout from '@/layouts/GuestLayout.vue'
import InputLabel from '@/components/base/InputLabel.vue'
import TextInput from '@/components/base/TextInput.vue'
import PrimaryButton from '@/components/base/PrimaryButton.vue'
import { reactive, ref, type Ref } from 'vue'
import type { AxiosError } from 'axios'
import { useAuthStore } from '@/stores/auth'

interface Form {
  email: string
  password: string
}

const authStore = useAuthStore()
const isLoading: Ref<boolean> = ref(false)
const form: Form = reactive({
  email: '',
  password: '',
})

const send = async () => {
  try {
    await authStore.login(form)
  } catch (error) {
    const err = error as AxiosError
    console.log(err)
  }
}
</script>
<template>
  <GuestLayout>
    <form @submit.prevent="send()" class="space-y-4">
      <div>
        <InputLabel>email</InputLabel>
        <TextInput type="email" class="mt-1 block w-full" v-model="form.email" />
      </div>
      <div>
        <InputLabel>password</InputLabel>
        <TextInput type="password" class="mt-1 block w-full" v-model="form.password" />
      </div>
      <div class="flex justify-end">
        <PrimaryButton :disabled="isLoading" type="submit">login</PrimaryButton>
      </div>
    </form>
  </GuestLayout>
</template>
