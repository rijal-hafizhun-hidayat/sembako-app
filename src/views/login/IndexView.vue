<script setup lang="ts">
import GuestLayout from '@/layouts/GuestLayout.vue'
import InputLabel from '@/components/base/InputLabel.vue'
import TextInput from '@/components/base/TextInput.vue'
import PrimaryButton from '@/components/base/PrimaryButton.vue'
import { reactive, ref, type Ref } from 'vue'

interface Form {
  email: string
  password: string
}

const isLoading: Ref<boolean> = ref(false)
const form: Form = reactive({
  email: '',
  password: '',
})
</script>
<template>
  <GuestLayout>
    <form class="space-y-4">
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
