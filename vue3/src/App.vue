<script setup lang="ts">
</script>

<template>
  <div>
    <nav class="bg-primary text-on-primary p-4 flex gap-4 font-medium shadow-md">
      <router-link to="/division" class="hover:text-primary-light transition-colors" active-class="text-primary-light font-bold">Danh sách Bộ phận</router-link>
      <router-link to="/division/new" class="hover:text-primary-light transition-colors" active-class="text-primary-light font-bold">Thêm Bộ phận</router-link>
      <router-link to="/goods-received-note" class="hover:text-primary-light transition-colors" active-class="text-primary-light font-bold">Lập Phiếu Nhập Kho</router-link>
    </nav>
    <router-view />
  </div>
</template>
