<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
console.log(route.params.userId)
</script>
<template>
  <DashboardLayout>
    <template #header>
      <div class="flex justify-between">
        <div>
          <h2 class="font-semibold text-xl text-gray-800 leading-tight">Update User</h2>
        </div>
      </div>
    </template>
  </DashboardLayout>
</template>
