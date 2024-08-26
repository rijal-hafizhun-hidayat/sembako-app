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

const router = useRouter()
const auth = userAuthStore()
const form = reactive({
  username: null,
  password: null
})
const validation = ref<any>([])

const sendData = () => {
  axios
    .post('login', {
      username: form.username,
      password: form.password
    })
    .then((res) => {
      auth.user.token = res.data.data.token
      auth.user.name = res.data.data.name

      return router.push({
        name: 'dashboard.index'
      })
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
          <TextInput class="mt-1 block w-full" type="text" v-model="form.username" autofocus />
          <InputError v-if="validation.username" :message="validation.username._errors[0]" />
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
