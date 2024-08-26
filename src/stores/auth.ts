import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const userAuthStore = defineStore('auth', () => {
  type user = {
    name: string | null
    token: string | null
  }

  const user: user = reactive({
    name: '',
    token: ''
  })

  return {
    user
  }
})
