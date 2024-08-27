import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const userAuthStore = defineStore('auth', () => {
  type User = {
    name: string | null
    token: string | null
  }

  const user: User = reactive({
    name: '',
    token: ''
  })

  return {
    user
  }
})
