<script setup lang="ts">
import InputLabel from '@/components/InputLabel.vue'
import InputError from '@/components/InputError.vue'
import PrimaryButton from '@/components/PrimaryButton.vue'
import TextInput from '@/components/TextInput.vue'
import GuestLayout from '@/layouts/GuestLayout.vue'
import { reactive, ref } from 'vue'
import axios from 'axios'
import { userAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

type Form = {
  email: string
  password: string
}

const router = useRouter()
const auth = userAuthStore()
const form: Form = reactive({
  email: '',
  password: ''
})
const validation = ref<any>([])

const sendData = () => {
  axios
    .post('login', {
      email: form.email,
      password: form.password
    })
    .then((res) => {
      console.log(res)
      auth.user.token = res.data.data.token as string
      auth.user.name = res.data.data.name as string
    })
    .catch((err) => {
      console.log(err)
    })
}

const showRegisterForm = () => {
  console.log(true)
}
</script>
<template>
  <GuestLayout>
    <form @submit.prevent="sendData">
      <div class="space-y-4">
        <div>
          <InputLabel>Username</InputLabel>
          <TextInput class="mt-1 block w-full" type="text" v-model="form.email" autofocus />
          <InputError v-if="validation.email" :message="validation.email._errors[0]" />
        </div>

        <div>
          <InputLabel>Password</InputLabel>
          <TextInput class="mt-1 block w-full" type="password" v-model="form.password" autofocus />
          <InputError v-if="validation.password" :message="validation.password._errors[0]" />
        </div>
      </div>

      <div class="flex items-center justify-between mt-4">
        <p class="text-sm">
          Belum memiliki akun? klik
          <span class="text-blue-500 underline cursor-pointer" @click="showRegisterForm()"
            >register</span
          >
        </p>
        <PrimaryButton type="submit">Masuk</PrimaryButton>
      </div>
    </form>
  </GuestLayout>
</template>
