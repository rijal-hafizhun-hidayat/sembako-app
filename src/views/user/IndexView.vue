<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import PrimaryButton from '@/components/base/PrimaryButton.vue'
</script>
<template>
  <DashboardLayout>
    <template #header>
      <div class="flex justify-between">
        <div>
          <h2 class="font-semibold text-xl text-gray-800 leading-tight">User</h2>
        </div>
        <div>
          <PrimaryButton>Add User</PrimaryButton>
        </div>
      </div>
    </template>
  </DashboardLayout>
</template>
