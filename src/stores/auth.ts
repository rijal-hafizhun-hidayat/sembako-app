import api from '@/plugins/api'
import type { AxiosResponse } from 'axios'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

interface Auth {
  id: number
  name: string
  email: string
  role: Role
}

interface Role {
  id: number
  name: string
  created_at: Date
  updated_at: Date
}

interface FormLogin {
  email: string
  password: string
}

interface Login {
  statusCode: number
  message: string
  data: Token
}

interface Token {
  token: string
}
export const useAuthStore = defineStore('auth', () => {
  const auth: Ref<Auth | null> = ref(null)
  const token: Ref<string | null> = ref(null)

  async function login(formLogin: FormLogin) {
    const result: AxiosResponse<Login> = await api.post<Login>('login', {
      email: formLogin.email,
      password: formLogin.password,
    })

    const data = result.data.data as Token
    token.value = data.token
    sessionStorage.setItem('token', token.value)
  }

  return {
    auth,
    token,
    login,
  }
})
