<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import PrimaryButton from '@/components/base/PrimaryButton.vue'
import DangerButton from '@/components/base/DangerButton.vue'
</script>
<template>
  <DashboardLayout>
    <template #header>
      <div class="flex justify-between">
        <div>
          <h2 class="font-semibold text-xl text-gray-800 leading-tight">Transaction</h2>
        </div>
        <div>
          <PrimaryButton>Add Transaction</PrimaryButton>
        </div>
      </div>
    </template>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white mt-10 px-4 py-6 rounded shadow-md overflow-x-auto">
        <table class="w-full whitespace-nowrap">
          <thead>
            <tr class="text-left font-bold">
              <th class="pb-4 pt-6 px-6">#</th>
              <th class="pb-4 pt-6 px-6">ID Transaction</th>
              <th class="pb-4 pt-6 px-6">Total</th>
              <th class="pb-4 pt-6 px-6">Created At</th>
              <th class="pb-4 pt-6 px-6">Updated At</th>
              <th class="pb-4 pt-6 px-6">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr class="hover:bg-gray-100">
              <td class="border-t items-center px-6 py-4">1</td>
              <td class="border-t items-center px-6 py-4">345</td>
              <td class="border-t items-center px-6 py-4">500000</td>
              <td class="border-t items-center px-6 py-4">12 januari 2025</td>
              <td class="border-t items-center px-6 py-4">12 februari 2025</td>
              <td class="border-t items-center px-6 py-4 flex justify-start space-x-4">
                <div>
                  <PrimaryButton type="button">Update</PrimaryButton>
                </div>
                <div>
                  <DangerButton type="button">Delete</DangerButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </DashboardLayout>
</template>
